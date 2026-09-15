# Bitácora de uso de IA

Registro de las veces que usé un asistente de IA (Claude Code) para tomar decisiones técnicas durante el desarrollo de este proyecto — no solo para generar código, sino para entender alternativas, debuggear problemas reales y elegir con criterio entre opciones.

Cada entrada tiene: el prompt/pregunta real que hice, qué aprendí de la respuesta o la investigación, y qué decisión terminé tomando.

> Nota para quien lea esto en la defensa: estas entradas están basadas en la conversación real con la IA durante el desarrollo (prompts y resultados tal cual pasaron). Las dejé redactadas en primera persona porque reflejan decisiones que efectivamente tomé — pero las repasé y las completé con mis propias palabras antes de entregar el proyecto.

---

## 1. Carrito: editar cantidades sin romper el patrón existente

**Fecha:** 2026-09-14

**Prompt:** "Necesito agregar un botón para que se pueda editar el carrito con un más y un menos... el botón que dice Inicio quisiera que diga Productos... donde dice Agregar que diga Agregar al carrito y donde dice Quitar que diga Quitar de favoritos."

**Qué aprendí:** Antes de tocar nada le pedí que revisara cómo estaba armado el contexto del carrito (`CartContext`, `cartReducer`, `CartProvider`). Ya existía una acción `UPDATE_QUANTITY` en el reducer que yo no estaba usando desde ningún componente — el reducer ya soportaba lo que necesitaba, solo faltaba conectarlo a la UI. Aprendí a revisar el estado real antes de agregar código nuevo, en vez de asumir que hacía falta una acción nueva.

**Decisión:** Agregué los botones +/- en `CartList.tsx` reutilizando `updateQuantity` que ya exponía `useCart()`, sin tocar el reducer. Los renombres de texto (Productos, Agregar al carrito, Quitar de favoritos) fueron cambios puntuales en `Header.tsx` y `FavoritesSidebar.tsx`.

---

## 2. Imágenes de producto que no coincidían con el nombre

**Fecha:** 2026-09-14

**Prompt:** "Tengo un babero con una imagen de un paisaje, ¿cómo puedo hacer una carga masiva de imágenes en este proyecto sin modificar mucho código para no romper?"

**Qué aprendí:** Mi primera hipótesis fue que el código de imágenes estaba mal. La investigación mostró algo distinto: el seed usaba `picsum.photos`, que devuelve fotos **totalmente al azar** — nunca tuvo relación con el producto. Probamos cambiar a `loremflickr.com` (permite buscar por palabra clave) pero ese servicio estaba devolviendo error 500 para casi cualquier combinación de tags en ese momento — aprendí que depender de un servicio gratis sin SLA es un riesgo real, no algo teórico. Terminamos usando la API de Pexels (búsqueda real de fotos), y aun así algunas búsquedas devolvían fotos de bebés en vez de fotos de producto — tuve que iterar la estrategia de búsqueda (agregar "product photo" a la query) y agregar lógica para no repetir la misma foto en dos productos distintos.

**Decisión:** Separé la lógica de catálogo + imágenes en `scripts/lib/catalog.ts`, reutilizada tanto por `scripts/seed.ts` (recrea todo) como por `scripts/update-images.ts` (actualiza solo el campo `image`, sin borrar productos — más seguro para volver a correr).

---

## 3. Códigos de descuento: ¿se valida en el cliente o en el servidor?

**Fecha:** 2026-09-14

**Prompt:** "¿Es muy difícil implementar códigos de descuento en el carrito? ¿Puedes hacer un plan y explicarme cómo lo harías?"

**Qué aprendí:** Le pedí explícitamente un plan antes de que escribiera código. La IA planteó dos caminos: validar el código leyendo Firestore directo desde el navegador (más simple) o crear una función serverless (`api/apply-coupon.ts`) que valide con Firebase Admin. El argumento que me convenció: si el descuento se calcula en el navegador, cualquiera puede editar el monto final con las herramientas de desarrollador antes de pagar — el mismo principio de por qué existen las presigned URLs para S3 (nunca confiar en el cliente para decidir algo que cuesta dinero).

**Decisión:** Elegí la opción con función serverless. El código del cupón se valida en `api/apply-coupon.ts`, la colección `coupons` en Firestore no tiene lectura pública (`allow read: if false`), y el carrito recalcula el descuento contra el subtotal actual cada vez que cambia (para que no quede desincronizado si se agrega o saca un producto después de aplicar el código).

---

## 4. Login con Google fallando solo en producción

**Fecha:** 2026-09-14

**Prompt:** "El Google Authenticator está fallando, ¿puedes chequear qué pasa?"

**Qué aprendí:** Funcionaba en local pero no en el deploy de Vercel. En vez de adivinar, se consultó directamente la configuración de Firebase Auth vía su API REST (`identitytoolkit.googleapis.com`) y encontré que la lista de "dominios autorizados" solo tenía `localhost` y los dominios de Firebase Hosting — nunca se había agregado el dominio real de Vercel. Aprendí que Firebase Auth valida el dominio desde el que se hace el login por seguridad (evita que un sitio ajeno use tu proyecto de Firebase para loguear gente), y que ese chequeo es independiente de si el proveedor de Google está bien configurado.

**Decisión:** Agregué `proyecto-m5-tamara-castronuovo-three.vercel.app` a los dominios autorizados. Aprendí a verificar esto como primer paso en cualquier proyecto que se deploya en un dominio distinto al de desarrollo.

---

## 5. `$189.95000000000002` en el total del carrito

**Fecha:** 2026-09-14

**Prompt:** Mandé una captura del carrito mostrando ese número y pedí "solo dejar dos decimales en el importe total".

**Qué aprendí:** No era un problema de formato de visualización nada más — es el clásico error de precisión de punto flotante de JavaScript (`0.1 + 0.2 !== 0.3`). Si solo redondeaba al mostrarlo (`.toFixed(2)`) pero seguía sumando con el error interno, el número guardado en Firestore para la orden iba a seguir siendo el "sucio". Aprendí a distinguir entre redondear **al calcular** (para que el dato guardado sea correcto) y formatear **al mostrar** (para que siempre se vean 2 decimales, incluso en montos exactos como $40).

**Decisión:** Creé `src/utils/money.ts` con `roundMoney()` (se usa en el reducer del carrito, donde se calculan los totales) y `formatPrice()` (se usa solo en la UI).

---

## 6. Tres deploys seguidos rotos en Vercel

**Fecha:** 2026-09-14

**Prompt:** Después de reportarme que la app en producción se veía "vieja" (sin los cupones ni el fix de decimales), pedí que lo investigara.

**Qué aprendí:** Con la CLI de Vercel (`vercel ls`) encontramos que los últimos 3 builds habían fallado. El log del build mostraba `Cannot find module '../src/types/coupon.types'` — un import mío en `api/apply-coupon.ts` sin la extensión `.ts`. Lo raro: mi chequeo local de TypeScript (`tsc --noEmit`) no lo detectaba, pero `tsc -b` con caché limpia sí. Aprendí que el proyecto usa `module: "nodenext"` en la config de TypeScript, que **exige** extensión explícita en los imports relativos — y que confiar en un chequeo local con caché puede ocultar errores que sí rompen el build real.

**Decisión:** Agregué la extensión faltante y adopté el hábito de correr `tsc -b --force` (sin caché) antes de dar un cambio por probado, no solo `tsc --noEmit`.

---

## 7. `/api/presign` crasheaba con error 500 sin ninguna pista clara

**Fecha:** 2026-09-14

**Prompt:** "No funciona el subir un producto nuevo, ¿puedes revisarlo?"

**Qué aprendí:** Mi primera hipótesis fue "faltan credenciales" — y de hecho encontré (y arreglé) que las credenciales de Firebase Admin nunca se habían configurado en Vercel. Pero después de arreglar eso, `/api/presign` **seguía** crasheando, mientras que `/api/apply-coupon` (que usa las mismas credenciales) funcionaba bien. Reviendo los logs de runtime de Vercel encontré el error real: `ERR_REQUIRE_ESM`. La librería `jwks-rsa` (que usa `firebase-admin/auth` para verificar tokens) depende de `jose` v6, que dejó de tener build para CommonJS — y Vercel empaqueta las funciones como CommonJS. El crash pasaba con solo *importar* el módulo, antes de que corriera cualquier código mío. Aprendí que un error 500 genérico puede tener una causa totalmente distinta a la que parece más obvia, y que hay que mirar los logs reales del entorno de producción, no solo probar en local.

**Decisión:** Forcé (`overrides` en `package.json`) que `jose` resuelva a la última versión con soporte CommonJS (4.15.9) dentro del árbol de `jwks-rsa`, después de confirmar que las únicas dos funciones que `jwks-rsa` usa de esa librería (`importJWK`, `exportSPKI`) existen igual en esa versión.

---

## 8. El proyecto no tenía ningún test

**Fecha:** 2026-09-15

**Prompt:** Le pedí que auditara el proyecto completo contra la guía de evaluación del PI5. Encontró que la Etapa 7 (testing) estaba completamente ausente.

**Qué aprendí:** Me explicó por qué el reducer del carrito es el mejor candidato para empezar: es una función pura (mismo estado + misma acción = mismo resultado siempre), no depende de React ni de servicios externos, así que se puede testear sin mockear nada. Para los hooks y el contexto sí hacía falta un approach distinto: `renderHook` con un wrapper de `<CartProvider>` real, y mockear `fetch` para no pegarle a la API real de cupones durante los tests.

**Decisión:** Instalé Vitest + React Testing Library y escribí tests en tres niveles: el reducer puro (`cartReducer.test.ts`, las 6 acciones), un hook aislado (`useDebounce.test.ts`, con fake timers) y un test de integración (`useCart.test.tsx`, contra el `CartProvider` real). Elegí esta combinación para poder explicar en la defensa la diferencia entre testear una función pura, un hook aislado y un flujo integrado.
