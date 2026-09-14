import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { CATALOG, getProductImage, slugify, type ProductDoc } from "./lib/catalog.ts";

// ======================================================
// FIREBASE
// ======================================================

// Firebase Admin (no el SDK de cliente): las reglas de Firestore
// exigen isAdmin() para escribir en "products", y este script corre
// desde Node sin una sesión de usuario logueado. Las mismas
// credenciales de service account que ya usa /api/presign.ts.
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "PEXELS_API_KEY",
] as const;

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    `❌ Faltan variables de entorno en tu .env: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();
const productsCollection = db.collection("products");

// Borra todo lo que haya en "products" antes de sembrar el catálogo
// nuevo. Necesario acá porque estamos cambiando de rubro (textiles ->
// bebés): si no, los 60 productos viejos quedan mezclados con los
// nuevos en vez de reemplazados.
async function clearProducts() {
  const existing = await productsCollection.get();

  if (existing.empty) return;

  console.log(`🧹 Borrando ${existing.size} productos existentes...\n`);

  const batch = db.batch();
  existing.docs.forEach((docSnapshot) => batch.delete(docSnapshot.ref));
  await batch.commit();
}

// ======================================================
// SEED
// ======================================================

async function seed() {
  await clearProducts();

  console.log(`🌱 Sembrando ${CATALOG.length} productos...\n`);

  // Compartido entre todos los productos de esta corrida: evita que
  // dos productos distintos terminen con la misma foto de Pexels.
  const usedPhotoIds = new Set<number>();

  for (const product of CATALOG) {
    // Id determinístico a partir del nombre: si volvés a correr el
    // seed, actualiza el mismo documento en vez de crear uno nuevo.
    const ref = productsCollection.doc(slugify(product.name));

    const productDoc: ProductDoc = {
      ...product,
      nameLower: product.name.toLowerCase(),
      image: await getProductImage(product, usedPhotoIds),
    };

    await ref.set({
      ...productDoc,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`✔ ${product.name}`);
  }

  console.log(`\n✅ ${CATALOG.length} productos creados correctamente.`);

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error al ejecutar el seeder:");
  console.error(error);
  process.exit(1);
});
