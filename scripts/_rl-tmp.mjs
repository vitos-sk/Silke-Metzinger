import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
const app = initializeApp({ credential: cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
})});
const db = getFirestore(app);
const snap = await db.collection("rateLimits").get();
const now = Date.now();
console.log(`Записей: ${snap.size}`);
snap.forEach(d => {
  const v = d.data();
  const minAgo = ((now - v.windowStart) / 60000).toFixed(0);
  console.log(`${d.id.slice(0,10)}…  count=${v.count}  окно началось ${minAgo} мин назад`);
});
