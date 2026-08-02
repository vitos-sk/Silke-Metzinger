export type PostFilter = "alle" | "events" | "beitraege" | "archiv";

export const POST_FILTERS: Array<{ id: PostFilter; label: string }> = [
  { id: "alle", label: "Alle" },
  { id: "events", label: "Events" },
  { id: "beitraege", label: "Beiträge" },
  { id: "archiv", label: "Archiv" },
];

export function parsePostFilter(value: string | string[] | undefined): PostFilter {
  return POST_FILTERS.some((filter) => filter.id === value) ? (value as PostFilter) : "alle";
}
