import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { CATALOG, getProductImage, slugify } from "./lib/catalog.ts";

// A diferencia de seed.ts, este script NO borra ni recrea productos:
// solo pisa el campo `image` de los que ya existen en Firestore. Útil
// para recargar imágenes sin perder ediciones hechas desde el panel
// de admin (precio, stock, descripción, productos nuevos, etc).

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

async function updateImages() {
  console.log(`🖼  Actualizando imágenes de ${CATALOG.length} productos...\n`);

  const usedPhotoIds = new Set<number>();
  let updated = 0;
  let skipped = 0;

  for (const product of CATALOG) {
    const ref = productsCollection.doc(slugify(product.name));
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      console.log(`⚠ No existe en Firestore, se omite: ${product.name}`);
      skipped++;
      continue;
    }

    const image = await getProductImage(product, usedPhotoIds);

    await ref.update({ image, updatedAt: FieldValue.serverTimestamp() });

    console.log(`✔ ${product.name}`);
    updated++;
  }

  console.log(`\n✅ ${updated} imágenes actualizadas${skipped ? `, ${skipped} omitidas` : ""}.`);

  process.exit(0);
}

updateImages().catch((error) => {
  console.error("❌ Error al actualizar las imágenes:");
  console.error(error);
  process.exit(1);
});
