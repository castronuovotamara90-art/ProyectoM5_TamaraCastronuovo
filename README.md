# Salvia & Co. — E-commerce

E-commerce de productos para bebés, desarrollado como proyecto del Módulo 5 de FT76.

🔗 **Demo en producción:** [proyecto-m5-tamara-castronuovo-three.vercel.app](https://proyecto-m5-tamara-castronuovo-three.vercel.app/)

📓 **Bitácora de uso de IA:** [BITACORA.md](./BITACORA.md)

## Stack

- **React 19 + TypeScript + Vite** — SPA con React Router.
- **Tailwind CSS 4** — estilos, con soporte de tema claro/oscuro.
- **Firebase**
  - **Firestore** — base de datos (productos, órdenes, usuarios, cupones).
  - **Authentication** — email/contraseña y Google.
  - **Firebase Admin SDK** — usado desde funciones serverless para operaciones privilegiadas (subida de imágenes, validación de cupones, scripts de seed).
- **AWS S3** — almacenamiento de imágenes subidas desde el panel de administración (con URLs firmadas, `api/presign.ts`).
- **Vercel** — hosting y funciones serverless (`api/*.ts`).
- **Pexels API** — búsqueda automática de fotos de producto para el catálogo (`scripts/seed.ts` / `scripts/update-images.ts`).

## Funcionalidades

### Tienda (usuarios)

- Catálogo de productos con búsqueda por nombre, filtro por categoría y paginación.
- Detalle de producto con carrusel de imágenes.
- Favoritos (agregar/quitar, sidebar dedicado).
- Carrito de compras:
  - Editar cantidades con botones **+ / −** por producto (respetando el stock disponible).
  - Aplicar **códigos de descuento** (porcentaje o monto fijo, con mínimo de compra opcional). El código se valida del lado del servidor (`api/apply-coupon.ts`) para que no se pueda manipular desde el navegador.
- Checkout con resumen de subtotal, descuento aplicado y total final.
- Historial de pedidos del usuario y detalle de cada uno.
- Login con email/contraseña o Google; rutas protegidas para carrito, checkout y pedidos.
- Tema claro/oscuro.

### Panel de administración (rol `admin`)

- Alta, edición y baja de productos, con subida de imágenes a S3.
- Listado y cambio de estado de todos los pedidos.
- Acceso restringido: solo usuarios con `role: 'admin'` en su documento de Firestore pueden entrar (`AdminRoute`, reforzado también por `firestore.rules`).

## Estructura del proyecto

```
api/                  Funciones serverless de Vercel (Firebase Admin)
  presign.ts           URL firmada de S3 para subir imágenes (solo admin)
  apply-coupon.ts       Valida códigos de descuento contra Firestore

src/
  assets/layouts/       Layout general, layout de admin, Header
  assets/common/        Componentes compartidos (cards, listas, sidebars)
  contexts/              Context + reducer de auth, carrito, favoritos, toast, tema
  pages/                 Una página por ruta
  services/              Llamadas a Firestore (productos, órdenes)
  types/                 Tipos compartidos (Product, Order, Coupon, etc.)

scripts/
  lib/catalog.ts         Catálogo base de 60 productos + búsqueda de imágenes en Pexels
  seed.ts                 Recrea todos los productos desde cero (borra y vuelve a crear)
  update-images.ts        Actualiza solo el campo `image` de los productos existentes (no destructivo)
  seed-coupons.ts          Crea los cupones de ejemplo

firestore.rules         Reglas de seguridad de Firestore
```

## Subida de imágenes: flujo de presigned URLs

El navegador **nunca** tiene las credenciales de AWS ni sube el archivo a través de nuestro propio servidor. En cambio:

```
Admin selecciona imagen (ImageUploader.tsx)
        │
        ▼
1. POST /api/presign  { filename, contentType, fileSize }
   + Header Authorization: Bearer <ID token de Firebase>
        │
        ▼
2. api/presign.ts (Vercel Function, corre en el servidor):
   a) Verifica el ID token con Firebase Admin (getAuth().verifyIdToken)
   b) Busca el usuario en Firestore y confirma que role === 'admin'
   c) Valida tipo de archivo (jpeg/png/webp) y tamaño (máx. 5MB)
   d) Genera un nombre de archivo único y sanitizado
   e) Pide a AWS (con las credenciales del servidor) una URL firmada
      con getSignedUrl() + PutObjectCommand, válida por 60 segundos
        │
        ▼
3. La función devuelve { url, publicUrl } al navegador
   (la URL firmada, NO las credenciales)
        │
        ▼
4. El navegador hace PUT directo a esa URL, subiendo el archivo
   directamente a S3 (upload.service.ts) — Vercel/nuestro servidor
   ya no participan en esta parte
        │
        ▼
5. Se guarda publicUrl como `image` del producto en Firestore
```

**Por qué es más seguro que subir el archivo a través del propio servidor:**
- Las credenciales de AWS (`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`) viven solo en las variables de entorno de la Vercel Function — jamás se envían al navegador ni aparecen en el bundle de JS.
- La URL firmada autoriza una única operación (`PUT` a una `key` específica) y expira en 60 segundos: aunque alguien la intercepte, no sirve para nada más.
- El archivo pesado (la imagen) nunca pasa por nuestro servidor — evita cargarlo con tráfico y límites de tamaño de las funciones serverless.
- La autorización (¿es admin?) se valida **antes** de generar la URL firmada, del lado del servidor — no alcanza con ocultar un botón en el frontend.

Código relevante: [`api/presign.ts`](./api/presign.ts) (genera la URL), [`src/services/upload.service.ts`](./src/services/upload.service.ts) (pide la URL y hace el PUT a S3), [`src/assets/common/ImageUploader.tsx`](./src/assets/common/ImageUploader.tsx) (UI).

## Puesta en marcha local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copiá `.env.example` a `.env` y completá los valores:

```bash
cp .env.example .env
```

- **`VITE_FIREBASE_*`**: configuración del proyecto de Firebase (Firebase Console → Configuración del proyecto → General).
- **`AWS_*` / `S3_BUCKET`**: credenciales de un bucket S3 (usadas solo por `api/presign.ts`, del lado del servidor).
- **`FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY`**: credenciales de una cuenta de servicio de Firebase (Firebase Console → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada). Se usan en las funciones de `api/` y en los scripts de `scripts/`.
- **`PEXELS_API_KEY`**: solo la usan `scripts/seed.ts` y `scripts/update-images.ts` para buscar fotos de producto. Se genera gratis en [pexels.com/api](https://www.pexels.com/api/).

### 3. Cargar datos de ejemplo

```bash
npm run seed          # crea los 60 productos del catálogo (borra los existentes)
npm run seed-coupons  # crea los cupones BIENVENIDA10 y ENVIOGRATIS
```

### 4. Levantar el proyecto

```bash
npm run dev
```

> Nota: `npm run dev` (Vite) no sirve las funciones de `api/`. Para probarlas localmente hace falta `vercel dev` (requiere login en Vercel), o simplemente probar contra el deploy de producción.

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Type-check + build de producción |
| `npm run lint` | Linter (ESLint) |
| `npm run test` | Corre la suite de tests una vez (Vitest) |
| `npm run test:watch` | Corre los tests en modo watch |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run seed` | Borra y recrea los 60 productos del catálogo |
| `npm run update-images` | Actualiza solo las imágenes de los productos existentes, sin borrar nada |
| `npm run seed-coupons` | Crea/actualiza los cupones de descuento de ejemplo |

## Testing

Con [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react). Cubre:

- **`src/contexts/cart/cartReducer.test.ts`** — las 6 acciones del reducer del carrito (agregar, eliminar, actualizar cantidad, limpiar, aplicar/quitar descuento), incluyendo casos límite (tope de stock, cantidad 0 elimina el item).
- **`src/hooks/useDebounce.test.ts`** — el hook de debounce aislado, con fake timers.
- **`src/contexts/cart/useCart.test.tsx`** — test de integración: `useCart()` a través de un `<CartProvider>` real (wrapper de provider reutilizable), incluyendo `applyDiscountCode` con `fetch` mockeado (no pega contra el servidor real).

```bash
npm run test
```

## Modelo de datos (Firestore)

- **`products`** — catálogo, lectura pública, escritura solo admin.
- **`orders`** — pedidos; cada usuario lee/crea los suyos, solo admin puede cambiar el estado.
- **`users`** — perfil y rol (`customer` / `admin`) de cada usuario autenticado.
- **`coupons`** — códigos de descuento; sin lectura directa desde el cliente, solo se validan a través de `api/apply-coupon.ts` con Firebase Admin.

Las reglas completas están en [`firestore.rules`](./firestore.rules).
