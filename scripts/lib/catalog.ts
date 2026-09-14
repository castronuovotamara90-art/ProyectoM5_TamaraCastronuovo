import type { CategoryId, Product } from "../../src/types/product.types.ts";

// ======================================================
// TIPOS
// ======================================================

export type ProductSeed = {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: CategoryId;
  material: string;
  color: string;
  ageRange?: string;
};

// Lo que realmente termina escrito en Firestore por cada producto.
// Tenerlo tipado explícitamente contra `Product` (el mismo tipo que
// consume la app) evita que el seed y la app se desincronicen.
export type ProductDoc = Omit<Product, "id" | "createdAt" | "updatedAt">;

// ======================================================
// CATÁLOGO
// 60 productos - 10 por categoría
// ======================================================

export const CATALOG: ProductSeed[] = [
  // ====================================================
  // 🍼 ALIMENTACIÓN
  // ====================================================

  {
    name: "Babero de Muselina Natural",
    description:
      "Babero ligero y absorbente confeccionado en muselina de algodón suave para las comidas del día a día.",
    price: 12.99,
    stock: 24,
    categoryId: "alimentacion",
    material: "Muselina de algodón",
    color: "Natural",
    ageRange: "0-24 meses",
  },
  {
    name: "Babero Impermeable Beige",
    description:
      "Babero práctico e impermeable, fácil de limpiar y pensado para acompañar las primeras comidas.",
    price: 14.99,
    stock: 18,
    categoryId: "alimentacion",
    material: "Poliéster impermeable",
    color: "Beige",
    ageRange: "6-24 meses",
  },
  {
    name: "Plato de Silicona Arena",
    description:
      "Plato infantil de silicona flexible con diseño sencillo y fácil de limpiar.",
    price: 18.99,
    stock: 15,
    categoryId: "alimentacion",
    material: "Silicona",
    color: "Arena",
    ageRange: "6-24 meses",
  },
  {
    name: "Cuenco de Silicona Verde Salvia",
    description:
      "Cuenco ligero de silicona diseñado para las primeras comidas y fácil de transportar.",
    price: 16.99,
    stock: 12,
    categoryId: "alimentacion",
    material: "Silicona",
    color: "Verde salvia",
    ageRange: "6-24 meses",
  },
  {
    name: "Vaso Infantil de Silicona",
    description:
      "Vaso reutilizable y ligero fabricado en silicona suave y resistente.",
    price: 13.99,
    stock: 20,
    categoryId: "alimentacion",
    material: "Silicona",
    color: "Rosa empolvado",
    ageRange: "6-24 meses",
  },
  {
    name: "Set de Cubiertos Infantil",
    description:
      "Set de cuchara y tenedor diseñado para acompañar al bebé durante sus primeras comidas.",
    price: 15.99,
    stock: 16,
    categoryId: "alimentacion",
    material: "Acero inoxidable y silicona",
    color: "Natural",
    ageRange: "6-24 meses",
  },
  {
    name: "Botella Infantil Verde",
    description:
      "Botella reutilizable y ligera para acompañar al bebé en casa y durante los paseos.",
    price: 21.99,
    stock: 14,
    categoryId: "alimentacion",
    material: "Acero inoxidable",
    color: "Verde salvia",
    ageRange: "12-36 meses",
  },
  {
    name: "Bolsa Térmica para Biberón",
    description:
      "Bolsa térmica compacta para transportar biberones y pequeños alimentos durante los paseos.",
    price: 24.99,
    stock: 10,
    categoryId: "alimentacion",
    material: "Algodón y aislamiento térmico",
    color: "Beige",
  },
  {
    name: "Set de Alimentación Natural",
    description:
      "Set compuesto por plato, cuenco, vaso y cubiertos para acompañar las primeras comidas.",
    price: 49.99,
    stock: 8,
    categoryId: "alimentacion",
    material: "Silicona",
    color: "Natural",
    ageRange: "6-24 meses",
  },
  {
    name: "Porta Biberón de Algodón",
    description:
      "Funda acolchada para transportar el biberón de forma cómoda y protegida.",
    price: 19.99,
    stock: 13,
    categoryId: "alimentacion",
    material: "Algodón acolchado",
    color: "Crudo",
  },

  // ====================================================
  // 🚼 PASEO
  // ====================================================

  {
    name: "Organizador para Carrito Beige",
    description:
      "Organizador amplio para tener a mano los pequeños esenciales durante los paseos.",
    price: 34.99,
    stock: 9,
    categoryId: "paseo",
    material: "Algodón reciclado",
    color: "Beige",
  },
  {
    name: "Cambiador Portátil Natural",
    description:
      "Cambiador plegable y acolchado para realizar cambios cómodamente fuera de casa.",
    price: 39.99,
    stock: 11,
    categoryId: "paseo",
    material: "Algodón",
    color: "Natural",
  },
  {
    name: "Bolso Maternal Minimal",
    description:
      "Bolso amplio y funcional para llevar todo lo necesario durante los paseos.",
    price: 69.99,
    stock: 7,
    categoryId: "paseo",
    material: "Algodón y poliéster reciclado",
    color: "Gris piedra",
  },
  {
    name: "Manta para Carrito de Algodón",
    description:
      "Manta ligera y suave para mantener al bebé cómodo durante los paseos.",
    price: 34.99,
    stock: 14,
    categoryId: "paseo",
    material: "Algodón",
    color: "Arena",
  },
  {
    name: "Portadocumentos Infantil",
    description:
      "Portadocumentos compacto para guardar de forma organizada la documentación del bebé.",
    price: 24.99,
    stock: 15,
    categoryId: "paseo",
    material: "Algodón",
    color: "Verde salvia",
  },
  {
    name: "Bolsa Multiusos para Carrito",
    description:
      "Bolsa ligera y versátil para llevar pequeños objetos durante los paseos.",
    price: 29.99,
    stock: 12,
    categoryId: "paseo",
    material: "Lona de algodón",
    color: "Natural",
  },
  {
    name: "Ganchos para Carrito",
    description:
      "Set de ganchos resistentes para colgar bolsos y accesorios del carrito.",
    price: 11.99,
    stock: 25,
    categoryId: "paseo",
    material: "Aluminio y goma",
    color: "Negro",
  },
  {
    name: "Neceser de Viaje Infantil",
    description:
      "Neceser compacto para organizar productos de higiene y pequeños accesorios.",
    price: 27.99,
    stock: 16,
    categoryId: "paseo",
    material: "Algodón",
    color: "Rosa empolvado",
  },
  {
    name: "Saco Universal para Carrito",
    description:
      "Saco acolchado y confortable para proteger al bebé durante los paseos.",
    price: 79.99,
    stock: 6,
    categoryId: "paseo",
    material: "Algodón y fibra reciclada",
    color: "Beige",
  },
  {
    name: "Bolsa de Viaje para Bebé",
    description:
      "Bolsa amplia con diferentes compartimentos para organizar los esenciales del bebé.",
    price: 59.99,
    stock: 8,
    categoryId: "paseo",
    material: "Lona de algodón",
    color: "Gris piedra",
  },

  // ====================================================
  // 🛁 HIGIENE
  // ====================================================

  {
    name: "Capa de Baño con Capucha",
    description:
      "Capa de baño suave y absorbente con capucha para envolver al bebé después del baño.",
    price: 29.99,
    stock: 14,
    categoryId: "higiene",
    material: "Algodón orgánico",
    color: "Natural",
    ageRange: "0-24 meses",
  },
  {
    name: "Toalla de Baño Algodón Orgánico",
    description:
      "Toalla de baño extra suave y absorbente fabricada con algodón orgánico.",
    price: 27.99,
    stock: 17,
    categoryId: "higiene",
    material: "Algodón orgánico",
    color: "Blanco roto",
  },
  {
    name: "Toalla Facial Infantil",
    description: "Pequeña toalla de algodón suave para el cuidado diario del bebé.",
    price: 9.99,
    stock: 30,
    categoryId: "higiene",
    material: "Algodón",
    color: "Beige",
  },
  {
    name: "Albornoz Infantil de Algodón",
    description: "Albornoz suave y absorbente pensado para después del baño.",
    price: 39.99,
    stock: 10,
    categoryId: "higiene",
    material: "Algodón",
    color: "Verde salvia",
    ageRange: "12-36 meses",
  },
  {
    name: "Neceser de Higiene Natural",
    description: "Neceser compacto para guardar productos de higiene y cuidado del bebé.",
    price: 24.99,
    stock: 13,
    categoryId: "higiene",
    material: "Algodón",
    color: "Natural",
  },
  {
    name: "Cepillo Suave para Bebé",
    description: "Cepillo de cerdas suaves diseñado para el cuidado delicado del cabello del bebé.",
    price: 12.99,
    stock: 20,
    categoryId: "higiene",
    material: "Madera y fibras naturales",
    color: "Natural",
  },
  {
    name: "Set de Peine y Cepillo",
    description: "Set de cuidado compuesto por peine y cepillo de fibras suaves.",
    price: 19.99,
    stock: 15,
    categoryId: "higiene",
    material: "Madera y fibras naturales",
    color: "Natural",
  },
  {
    name: "Organizador de Baño",
    description: "Organizador práctico para mantener ordenados los accesorios de higiene.",
    price: 32.99,
    stock: 9,
    categoryId: "higiene",
    material: "Algodón y poliéster",
    color: "Beige",
  },
  {
    name: "Set de Baño Natural",
    description: "Set compuesto por capa de baño, toalla facial y accesorio de cuidado.",
    price: 49.99,
    stock: 8,
    categoryId: "higiene",
    material: "Algodón orgánico",
    color: "Natural",
  },
  {
    name: "Esponja Natural para Bebé",
    description: "Esponja suave para acompañar la rutina diaria del baño.",
    price: 8.99,
    stock: 22,
    categoryId: "higiene",
    material: "Fibra natural",
    color: "Natural",
  },

  // ====================================================
  // 🌙 DORMITORIO
  // ====================================================

  {
    name: "Arrullo de Muselina Natural",
    description:
      "Arrullo ligero y transpirable para envolver al bebé y acompañarlo durante el descanso.",
    price: 29.99,
    stock: 18,
    categoryId: "dormitorio",
    material: "Muselina de algodón",
    color: "Natural",
    ageRange: "0-12 meses",
  },
  {
    name: "Manta de Algodón Beige",
    description: "Manta suave y ligera para utilizar en casa, la cuna o el carrito.",
    price: 34.99,
    stock: 15,
    categoryId: "dormitorio",
    material: "Algodón",
    color: "Beige",
  },
  {
    name: "Manta de Punto Natural",
    description: "Manta de punto suave con diseño atemporal para acompañar los momentos de descanso.",
    price: 44.99,
    stock: 11,
    categoryId: "dormitorio",
    material: "Algodón",
    color: "Crudo",
  },
  {
    name: "Saco de Dormir Natural",
    description: "Saco de dormir suave y confortable para acompañar las rutinas de descanso.",
    price: 49.99,
    stock: 9,
    categoryId: "dormitorio",
    material: "Algodón orgánico",
    color: "Natural",
    ageRange: "0-12 meses",
  },
  {
    name: "Sábana de Cuna Algodón",
    description: "Sábana suave y transpirable confeccionada en algodón para la cuna.",
    price: 24.99,
    stock: 16,
    categoryId: "dormitorio",
    material: "Algodón",
    color: "Blanco roto",
  },
  {
    name: "Protector de Cuna Natural",
    description: "Protector acolchado con diseño minimalista para completar el espacio de descanso.",
    price: 44.99,
    stock: 7,
    categoryId: "dormitorio",
    material: "Algodón",
    color: "Beige",
  },
  {
    name: "Cesta Organizadora de Cuna",
    description: "Cesta ligera para mantener organizados pequeños accesorios junto a la cuna.",
    price: 27.99,
    stock: 12,
    categoryId: "dormitorio",
    material: "Algodón trenzado",
    color: "Natural",
  },
  {
    name: "Luz Nocturna Nube",
    description: "Luz nocturna decorativa con iluminación suave para acompañar las rutinas nocturnas.",
    price: 29.99,
    stock: 10,
    categoryId: "dormitorio",
    material: "Silicona",
    color: "Blanco",
  },
  {
    name: "Móvil de Cuna de Madera",
    description: "Móvil decorativo de madera con formas suaves para completar el espacio del bebé.",
    price: 39.99,
    stock: 6,
    categoryId: "dormitorio",
    material: "Madera",
    color: "Natural",
  },
  {
    name: "Set de Arrullo y Manta",
    description: "Set de dos piezas compuesto por arrullo de muselina y manta ligera de algodón.",
    price: 59.99,
    stock: 8,
    categoryId: "dormitorio",
    material: "Algodón y muselina",
    color: "Arena",
    ageRange: "0-12 meses",
  },

  // ====================================================
  // 🧸 JUGUETES
  // ====================================================

  {
    name: "Mordedor de Madera Natural",
    description: "Mordedor ligero de madera natural diseñado para las pequeñas manos del bebé.",
    price: 14.99,
    stock: 20,
    categoryId: "juguetes",
    material: "Madera",
    color: "Natural",
    ageRange: "3-12 meses",
  },
  {
    name: "Mordedor de Silicona Arena",
    description: "Mordedor de silicona flexible y fácil de limpiar para acompañar la etapa de dentición.",
    price: 15.99,
    stock: 18,
    categoryId: "juguetes",
    material: "Silicona",
    color: "Arena",
    ageRange: "3-12 meses",
  },
  {
    name: "Sonajero de Madera",
    description: "Sonajero ligero de madera con un diseño sencillo y agradable al tacto.",
    price: 17.99,
    stock: 14,
    categoryId: "juguetes",
    material: "Madera",
    color: "Natural",
    ageRange: "3-12 meses",
  },
  {
    name: "Sonajero de Tela",
    description: "Sonajero suave de tela con diferentes texturas para estimular los sentidos.",
    price: 19.99,
    stock: 13,
    categoryId: "juguetes",
    material: "Algodón",
    color: "Beige",
    ageRange: "0-12 meses",
  },
  {
    name: "Juguete de Madera Arcoíris",
    description: "Juguete de madera con formas curvas para estimular el juego y la exploración.",
    price: 24.99,
    stock: 9,
    categoryId: "juguetes",
    material: "Madera",
    color: "Natural",
    ageRange: "12-36 meses",
  },
  {
    name: "Libro Sensorial de Tela",
    description: "Libro blando con diferentes texturas pensado para estimular la exploración sensorial.",
    price: 22.99,
    stock: 11,
    categoryId: "juguetes",
    material: "Algodón",
    color: "Multicolor",
    ageRange: "0-24 meses",
  },
  {
    name: "Pelota Sensorial de Silicona",
    description: "Pelota ligera con diferentes texturas para estimular el tacto y el movimiento.",
    price: 18.99,
    stock: 15,
    categoryId: "juguetes",
    material: "Silicona",
    color: "Verde salvia",
    ageRange: "6-24 meses",
  },
  {
    name: "Peluchito Conejo",
    description: "Suave compañero de juego fabricado con materiales agradables y diseño minimalista.",
    price: 26.99,
    stock: 8,
    categoryId: "juguetes",
    material: "Algodón",
    color: "Crudo",
    ageRange: "0-24 meses",
  },
  {
    name: "Juguete para Baño Barquitos",
    description: "Set de pequeños juguetes flotantes para hacer más divertida la hora del baño.",
    price: 16.99,
    stock: 12,
    categoryId: "juguetes",
    material: "Silicona",
    color: "Multicolor",
    ageRange: "6-24 meses",
  },
  {
    name: "Set de Cubos Sensoriales",
    description: "Set de cubos blandos con diferentes formas, texturas y estímulos visuales.",
    price: 29.99,
    stock: 7,
    categoryId: "juguetes",
    material: "Silicona",
    color: "Multicolor",
    ageRange: "6-24 meses",
  },

  // ====================================================
  // 🧺 ORGANIZACIÓN
  // ====================================================

  {
    name: "Cesta Organizadora de Algodón",
    description: "Cesta ligera y resistente para mantener organizados los pequeños accesorios del bebé.",
    price: 29.99,
    stock: 15,
    categoryId: "organizacion",
    material: "Algodón trenzado",
    color: "Natural",
  },
  {
    name: "Cesta Grande para Juguetes",
    description: "Cesta amplia para guardar juguetes y mantener ordenado el espacio del bebé.",
    price: 39.99,
    stock: 9,
    categoryId: "organizacion",
    material: "Algodón",
    color: "Beige",
  },
  {
    name: "Organizador de Pañales",
    description: "Organizador con compartimentos para mantener pañales y accesorios siempre a mano.",
    price: 27.99,
    stock: 12,
    categoryId: "organizacion",
    material: "Fieltro reciclado",
    color: "Gris piedra",
  },
  {
    name: "Bolsa para Ropa de Bebé",
    description: "Bolsa de tela para organizar y transportar pequeñas prendas y accesorios.",
    price: 19.99,
    stock: 17,
    categoryId: "organizacion",
    material: "Algodón",
    color: "Natural",
  },
  {
    name: "Bolsa para Pañales",
    description: "Bolsa compacta para organizar pañales y pequeños productos durante los desplazamientos.",
    price: 17.99,
    stock: 14,
    categoryId: "organizacion",
    material: "Algodón",
    color: "Beige",
  },
  {
    name: "Neceser de Lino Natural",
    description: "Neceser sencillo y funcional para organizar productos de cuidado y accesorios.",
    price: 24.99,
    stock: 11,
    categoryId: "organizacion",
    material: "Lino",
    color: "Natural",
  },
  {
    name: "Portachupetes de Silicona",
    description: "Pequeño estuche para mantener el chupete protegido y organizado.",
    price: 14.99,
    stock: 20,
    categoryId: "organizacion",
    material: "Silicona",
    color: "Rosa empolvado",
  },
  {
    name: "Organizador de Carrito",
    description: "Organizador con diferentes compartimentos para mantener los accesorios del bebé ordenados.",
    price: 34.99,
    stock: 8,
    categoryId: "organizacion",
    material: "Algodón reciclado",
    color: "Verde salvia",
  },
  {
    name: "Caja Organizadora de Tela",
    description: "Caja plegable de tela para guardar juguetes, accesorios y pequeños objetos.",
    price: 22.99,
    stock: 13,
    categoryId: "organizacion",
    material: "Algodón",
    color: "Crudo",
  },
  {
    name: "Set de Bolsas Organizadoras",
    description: "Set de tres bolsas de diferentes tamaños para organizar los esenciales del bebé.",
    price: 32.99,
    stock: 10,
    categoryId: "organizacion",
    material: "Algodón",
    color: "Natural",
  },
];

// ======================================================
// IMÁGENES (Pexels)
// ======================================================

// Búsqueda real de fotos por palabra clave (a diferencia de
// LoremFlickr, que arma la URL "a ciegas" y puede devolver cualquier
// cosa -o un error 500- cuando la combinación de tags no tiene
// resultados). Requiere PEXELS_API_KEY, gratis en pexels.com/api.
//
// `usedPhotoIds` evita que dos productos distintos terminen con la
// misma foto cuando sus búsquedas empatan en el mismo resultado top
// (ej: "wooden teether" y "wooden rattle" comparten fotos populares).
async function fetchPexelsImage(
  query: string,
  usedPhotoIds: Set<number>
): Promise<string | null> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
    query
  )}&per_page=5&orientation=square`;

  const response = await fetch(url, {
    headers: { Authorization: process.env.PEXELS_API_KEY! },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    photos?: { id: number; src: { large: string } }[];
  };

  const photos = data.photos ?? [];
  if (photos.length === 0) return null;

  const unused = photos.find((photo) => !usedPhotoIds.has(photo.id));
  const chosen = unused ?? photos[0];

  usedPhotoIds.add(chosen.id);
  return chosen.src.large;
}

const IMAGE_QUERIES: Record<string, string> = {
  // ALIMENTACIÓN
  "Babero de Muselina Natural": "baby,bib,muslin",
  "Babero Impermeable Beige": "baby,bib,feeding",
  "Plato de Silicona Arena": "baby,silicone,plate",
  "Cuenco de Silicona Verde Salvia": "baby,silicone,bowl",
  "Vaso Infantil de Silicona": "baby,silicone,cup",
  "Set de Cubiertos Infantil": "baby,cutlery,feeding",
  "Botella Infantil Verde": "baby,bottle",
  "Bolsa Térmica para Biberón": "baby,bottle,bag",
  "Set de Alimentación Natural": "baby,feeding,set",
  "Porta Biberón de Algodón": "baby,bottle,holder",

  // PASEO
  "Organizador para Carrito Beige": "baby,stroller,organizer",
  "Cambiador Portátil Natural": "baby,changing,mat",
  "Bolso Maternal Minimal": "baby,diaper,bag",
  "Manta para Carrito de Algodón": "baby,blanket,stroller",
  "Portadocumentos Infantil": "baby,documents,organizer",
  "Bolsa Multiusos para Carrito": "baby,stroller,bag",
  "Ganchos para Carrito": "baby,stroller,hooks",
  "Neceser de Viaje Infantil": "baby,travel,toiletry,bag",
  "Saco Universal para Carrito": "baby,stroller,footmuff",
  "Bolsa de Viaje para Bebé": "baby,travel,bag",

  // HIGIENE
  "Capa de Baño con Capucha": "baby,bath,towel",
  "Toalla de Baño Algodón Orgánico": "baby,bath,towel",
  "Toalla Facial Infantil": "baby,washcloth,towel",
  "Albornoz Infantil de Algodón": "baby,bathrobe",
  "Neceser de Higiene Natural": "baby,toiletry,bag",
  "Cepillo Suave para Bebé": "baby,hairbrush",
  "Set de Peine y Cepillo": "baby,comb,brush",
  "Organizador de Baño": "baby,bath,organizer",
  "Set de Baño Natural": "baby,bath,set",
  "Esponja Natural para Bebé": "baby,bath,sponge",

  // DORMITORIO
  "Arrullo de Muselina Natural": "baby,muslin,swaddle",
  "Manta de Algodón Beige": "baby,cotton,blanket",
  "Manta de Punto Natural": "baby,knit,blanket",
  "Saco de Dormir Natural": "baby,sleeping,bag",
  "Sábana de Cuna Algodón": "baby,crib,sheet",
  "Protector de Cuna Natural": "baby,crib,bumper",
  "Cesta Organizadora de Cuna": "baby,nursery,basket",
  "Luz Nocturna Nube": "night light,cloud,lamp",
  "Móvil de Cuna de Madera": "baby,crib,mobile",
  "Set de Arrullo y Manta": "baby,swaddle,blanket",

  // JUGUETES
  "Mordedor de Madera Natural": "wooden,baby,teether,toy",
  "Mordedor de Silicona Arena": "silicone,baby,teether,toy",
  "Sonajero de Madera": "wooden,baby,rattle,toy",
  "Sonajero de Tela": "fabric,baby,rattle,toy",
  "Juguete de Madera Arcoíris": "baby,wooden,rainbow,toy",
  "Libro Sensorial de Tela": "baby,fabric,sensory,book",
  "Pelota Sensorial de Silicona": "baby,sensory,ball",
  "Peluchito Conejo": "baby,bunny,plush",
  "Juguete para Baño Barquitos": "baby,bath,toys",
  "Set de Cubos Sensoriales": "baby,sensory,blocks",

  // ORGANIZACIÓN
  "Cesta Organizadora de Algodón": "baby,cotton,basket",
  "Cesta Grande para Juguetes": "baby,toy,basket",
  "Organizador de Pañales": "baby,diaper,organizer",
  "Bolsa para Ropa de Bebé": "baby,clothes,bag",
  "Bolsa para Pañales": "baby,diaper,bag",
  "Neceser de Lino Natural": "linen,toiletry,bag",
  "Portachupetes de Silicona": "baby,pacifier,holder",
  "Organizador de Carrito": "baby,stroller,organizer",
  "Caja Organizadora de Tela": "fabric,storage,box",
  "Set de Bolsas Organizadoras": "fabric,organizer,bags",
};

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// `usedPhotoIds` se comparte entre todas las llamadas de una misma
// corrida (seed o update-images) para no repetir la misma foto en
// dos productos distintos.
export async function getProductImage(
  product: ProductSeed,
  usedPhotoIds: Set<number>
): Promise<string> {
  const tags = IMAGE_QUERIES[product.name] ?? "baby,products";
  const query = tags.replace(/,/g, " ");

  // "product photo" al final sesga a Pexels hacia fotos de producto
  // (fondo liso, foco en el objeto) en vez de fotos de bebés en
  // situaciones cotidianas, que son mucho más comunes en el banco.
  const productShot = await fetchPexelsImage(`${query} product photo`, usedPhotoIds);
  if (productShot) return productShot;

  const specific = await fetchPexelsImage(query, usedPhotoIds);
  if (specific) return specific;

  // Sin resultados para la búsqueda específica: probamos algo más
  // genérico antes de rendirnos, para no dejar el producto sin imagen.
  const generic = await fetchPexelsImage("baby products", usedPhotoIds);
  if (generic) return generic;

  // Último recurso si Pexels no devolvió nada en ninguna búsqueda (no
  // debería pasar, pero el script no puede colgarse acá).
  return `https://picsum.photos/seed/${slugify(product.name)}/600/600`;
}
