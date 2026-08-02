export type PostType = "event" | "announcement" | "article";

export type PostBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading"; text: string; level: 2 | 3 }
  | {
      id: string;
      type: "image";
      url: string;
      alt: string;
      caption: string | null;
      // normal = in der Textspalte, wide = über die volle Breite
      width: "normal" | "wide";
    }
  | { id: string; type: "quote"; text: string; author: string | null }
  | { id: string; type: "list"; style: "bullet" | "number"; items: string[] }
  | { id: string; type: "button"; label: string; href: string }
  | { id: string; type: "divider" };

export interface Post {
  id: string;
  type: PostType;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  coverImageAlt: string;
  blocks: PostBlock[];
  // Nur für type === "event":
  eventDate: string | null;
  eventTime: string | null;
  eventLocation: string | null;
  eventCtaLabel: string | null;
  eventCtaHref: string | null;
  // Veröffentlichung:
  status: "draft" | "published";
  publishedAt: number;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export type PostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

export const POST_TYPE_LABELS: Record<PostType, string> = {
  event: "Event",
  announcement: "Ankündigung",
  article: "Beitrag",
};

export const EXCERPT_MAX_LENGTH = 200;
