import { getDb } from "@/lib/firebaseAdmin";
import type { NewsEvent, NewsEventInput } from "@/types/event";

const COLLECTION = "events";

export async function listEvents(): Promise<NewsEvent[]> {
  // Kein orderBy("order") in der Query: Firestore schliesst Dokumente ohne
  // dieses Feld stillschweigend aus dem Ergebnis aus. Stattdessen alle laden
  // und mit Fallback client-seitig sortieren, damit keine Events verschwinden.
  const snapshot = await getDb().collection(COLLECTION).get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, order: 0, ...doc.data() }) as NewsEvent)
    .sort((a, b) => a.order - b.order);
}

export async function getEvent(id: string): Promise<NewsEvent | null> {
  const doc = await getDb().collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as NewsEvent;
}

export async function createEvent(input: NewsEventInput): Promise<string> {
  const now = Date.now();
  const doc = await getDb()
    .collection(COLLECTION)
    .add({ ...input, createdAt: now, updatedAt: now });
  return doc.id;
}

export async function updateEvent(id: string, input: NewsEventInput): Promise<void> {
  await getDb()
    .collection(COLLECTION)
    .doc(id)
    .update({ ...input, updatedAt: Date.now() });
}

export async function deleteEvent(id: string): Promise<void> {
  await getDb().collection(COLLECTION).doc(id).delete();
}
