import { getDb } from "@/lib/firebaseAdmin";
import type { Post, PostBlock, PostInput, PostType } from "@/types/post";

const COLLECTION = "posts";

const POST_TYPES: PostType[] = ["event", "announcement", "article"];

function toPost(id: string, data: FirebaseFirestore.DocumentData): Post {
  const type = POST_TYPES.includes(data.type as PostType)
    ? (data.type as PostType)
    : "article";

  return {
    id,
    type,
    title: typeof data.title === "string" ? data.title : "",
    slug: typeof data.slug === "string" ? data.slug : id,
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    coverImageUrl: typeof data.coverImageUrl === "string" ? data.coverImageUrl : null,
    coverImageAlt: typeof data.coverImageAlt === "string" ? data.coverImageAlt : "",
    blocks: Array.isArray(data.blocks) ? (data.blocks as PostBlock[]) : [],
    eventDate: typeof data.eventDate === "string" ? data.eventDate : null,
    eventTime: typeof data.eventTime === "string" ? data.eventTime : null,
    eventLocation: typeof data.eventLocation === "string" ? data.eventLocation : null,
    eventCtaLabel: typeof data.eventCtaLabel === "string" ? data.eventCtaLabel : null,
    eventCtaHref: typeof data.eventCtaHref === "string" ? data.eventCtaHref : null,
    status: data.status === "published" ? "published" : "draft",
    publishedAt: typeof data.publishedAt === "number" ? data.publishedAt : 0,
    pinned: data.pinned === true,
    createdAt: typeof data.createdAt === "number" ? data.createdAt : 0,
    updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : 0,
  };
}

// Angepinnte Beiträge zuerst, danach das neueste Veröffentlichungsdatum.
export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.publishedAt - a.publishedAt;
  });
}

// Heutiges Datum als ISO-String in Schweizer Zeit — "sv-SE" liefert das
// Format YYYY-MM-DD, das sich direkt mit eventDate vergleichen lässt.
export function todayIso(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich" }).format(new Date());
}

export function isPastEvent(post: Post): boolean {
  return post.type === "event" && post.eventDate !== null && post.eventDate < todayIso();
}

export async function listPosts(): Promise<Post[]> {
  // Kein orderBy in der Query: Firestore schliesst Dokumente ohne das
  // sortierte Feld stillschweigend aus dem Ergebnis aus. Stattdessen alle
  // laden und im Code sortieren, damit kein Beitrag verschwindet.
  const snapshot = await getDb().collection(COLLECTION).get();
  return sortPosts(snapshot.docs.map((doc) => toPost(doc.id, doc.data())));
}

export async function listPublishedPosts(): Promise<Post[]> {
  const posts = await listPosts();
  return posts.filter((post) => post.status === "published");
}

export async function listLatestPosts(limit: number): Promise<Post[]> {
  const posts = await listPublishedPosts();
  return posts.filter((post) => !isPastEvent(post)).slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const snapshot = await getDb()
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  const doc = snapshot.docs[0];
  if (!doc) return null;
  return toPost(doc.id, doc.data());
}

export async function getPost(id: string): Promise<Post | null> {
  const doc = await getDb().collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return toPost(doc.id, doc.data()!);
}

export async function isSlugTaken(slug: string, exceptId?: string): Promise<boolean> {
  const snapshot = await getDb().collection(COLLECTION).where("slug", "==", slug).get();
  return snapshot.docs.some((doc) => doc.id !== exceptId);
}

// Hängt -2, -3, … an, bis der Slug frei ist.
export async function findFreeSlug(slug: string, exceptId?: string): Promise<string> {
  let candidate = slug;
  let suffix = 2;
  while (await isSlugTaken(candidate, exceptId)) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function createPost(input: PostInput): Promise<string> {
  const now = Date.now();
  const doc = await getDb()
    .collection(COLLECTION)
    .add({ ...input, createdAt: now, updatedAt: now });
  return doc.id;
}

export async function updatePost(id: string, input: PostInput): Promise<void> {
  await getDb()
    .collection(COLLECTION)
    .doc(id)
    .update({ ...input, updatedAt: Date.now() });
}

export async function deletePost(id: string): Promise<void> {
  await getDb().collection(COLLECTION).doc(id).delete();
}
