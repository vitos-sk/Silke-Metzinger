import { del } from "@vercel/blob";
import type { Post, PostInput } from "@/types/post";
import { listPosts } from "@/lib/posts";

// Nur URLs aus dem eigenen Blob Store dürfen gelöscht werden. Externe Bild-URLs
// (z. B. per Hand in einen Bildblock eingetragen) bleiben unberührt.
function isOwnBlobUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

// Alle Bild-URLs eines Beitrags: Titelbild plus alle Bildblöcke.
export function collectImageUrls(post: Post | PostInput): string[] {
  const urls: string[] = [];

  if (post.coverImageUrl) urls.push(post.coverImageUrl);

  for (const block of post.blocks) {
    if (block.type === "image" && block.url) urls.push(block.url);
  }

  return urls.filter(isOwnBlobUrl);
}

// Löscht die übergebenen Blobs, sofern sie in keinem anderen Beitrag mehr
// verwendet werden. Fehler werden bewusst nur geloggt: Das Speichern bzw.
// Löschen eines Beitrags darf nicht daran scheitern, dass ein Blob schon
// weg ist.
async function deleteUnusedBlobs(urls: string[], exceptPostId: string): Promise<void> {
  if (urls.length === 0) return;

  // Der gesamte Block ist abgesichert: Auch ein Firestore-Ausfall beim
  // Nachschlagen der anderen Beitraege darf das bereits gespeicherte bzw.
  // geloeschte Ergebnis nicht mit einem Fehler ueberschreiben. Im
  // schlimmsten Fall bleibt eine unbenutzte Datei liegen - die findet
  // spaeter "npm run blob:orphans".
  try {
    const posts = await listPosts();
    const stillUsed = new Set<string>();

    for (const post of posts) {
      if (post.id === exceptPostId) continue;
      for (const url of collectImageUrls(post)) stillUsed.add(url);
    }

    const orphans = [...new Set(urls)].filter((url) => !stillUsed.has(url));
    if (orphans.length === 0) return;

    await del(orphans);
  } catch (error) {
    console.error("Blob-Aufraeumen fehlgeschlagen:", error);
  }
}

// Nach dem Löschen eines Beitrags: alle seine Bilder entfernen.
export async function deletePostBlobs(post: Post): Promise<void> {
  await deleteUnusedBlobs(collectImageUrls(post), post.id);
}

// Nach dem Bearbeiten: nur die Bilder entfernen, die im neuen Stand fehlen
// (ausgetauschtes Titelbild, gelöschte Bildblöcke).
export async function deleteRemovedPostBlobs(
  previous: Post,
  next: PostInput,
): Promise<void> {
  const kept = new Set(collectImageUrls(next));
  const removed = collectImageUrls(previous).filter((url) => !kept.has(url));

  await deleteUnusedBlobs(removed, previous.id);
}
