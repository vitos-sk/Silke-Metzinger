import { list } from "@vercel/blob";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);
const snapshot = await db.collection("posts").get();

const used = new Set();
for (const doc of snapshot.docs) {
  const d = doc.data();
  if (typeof d.coverImageUrl === "string") used.add(d.coverImageUrl);
  for (const b of Array.isArray(d.blocks) ? d.blocks : []) {
    if (b?.type === "image" && typeof b.url === "string") used.add(b.url);
  }
}

const blobs = [];
let cursor;
do {
  const r = await list({ cursor, limit: 1000 });
  blobs.push(...r.blobs);
  cursor = r.cursor;
} while (cursor);

const orphans = blobs.filter((b) => !used.has(b.url));
const keep = blobs.filter((b) => used.has(b.url));

console.log(`Постов в Firestore: ${snapshot.size}, использованных URL: ${used.size}`);
console.log(`\nИСПОЛЬЗУЮТСЯ (${keep.length}):`);
for (const b of keep) console.log(`  ${(b.size / 1024).toFixed(0)} KB  ${b.pathname}`);
console.log(`\nНЕ ИСПОЛЬЗУЮТСЯ (${orphans.length}), всего ${(orphans.reduce((s, b) => s + b.size, 0) / 1024 / 1024).toFixed(2)} MB:`);
for (const b of orphans) console.log(`  ${(b.size / 1024).toFixed(0)} KB  ${b.pathname}   (загружен ${b.uploadedAt})`);

if (process.argv.includes("--delete") && orphans.length) {
  const { del } = await import("@vercel/blob");
  await del(orphans.map((b) => b.url));
  console.log(`\nУдалено: ${orphans.length} файлов.`);
}

process.exit(0);
