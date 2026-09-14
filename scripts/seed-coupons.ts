import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import type { Coupon } from "../src/types/coupon.types.ts";

const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
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

const COUPONS: Coupon[] = [
  {
    code: "BIENVENIDA10",
    type: "percentage",
    value: 10,
    active: true,
  },
  {
    code: "ENVIOGRATIS",
    type: "fixed",
    value: 5,
    minPurchase: 30,
    active: true,
  },
];

async function seedCoupons() {
  console.log(`🎟️  Sembrando ${COUPONS.length} cupones...\n`);

  for (const coupon of COUPONS) {
    await db
      .collection("coupons")
      .doc(coupon.code)
      .set({ ...coupon, createdAt: FieldValue.serverTimestamp() });

    console.log(`✔ ${coupon.code}`);
  }

  console.log(`\n✅ ${COUPONS.length} cupones creados correctamente.`);
  process.exit(0);
}

seedCoupons().catch((error) => {
  console.error("❌ Error al sembrar los cupones:");
  console.error(error);
  process.exit(1);
});
