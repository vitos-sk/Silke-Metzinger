"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  Check,
  Clock,
  Eye,
  ImagePlus,
  Link2,
  Loader2,
  MapPin,
  Megaphone,
  PenLine,
  Pin,
  RotateCcw,
  Text,
  Type,
  X,
} from "lucide-react";
import { EXCERPT_MAX_LENGTH, type Post, type PostBlock, type PostType } from "@/types/post";
import { excerptFromBlocks } from "@/lib/postContent";
import { toDateTimeLocalValue } from "@/lib/postDate";
import { slugify } from "@/lib/slug";
import { SITE_URL } from "@/lib/site";
import BlockEditor from "./BlockEditor";
import PostPreview from "./PostPreview";
import { uploadImage } from "./uploadImage";

interface PostFormProps {
  initialPost?: Post;
}

interface Draft {
  type: PostType;
  title: string;
  slug: string;
  slugTouched: boolean;
  excerpt: string;
  coverImageUrl: string | null;
  coverImageAlt: string;
  blocks: PostBlock[];
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventCtaLabel: string;
  eventCtaHref: string;
  status: "draft" | "published";
  publishedAt: string;
  pinned: boolean;
}

type SlugState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "free" }
  | { status: "taken"; suggestion: string };

const TYPE_OPTIONS: Array<{
  type: PostType;
  label: string;
  icon: typeof Calendar;
  hint: string;
}> = [
  {
    type: "event",
    label: "Event",
    icon: Calendar,
    hint: "Mit Datum, Ort und Anmelde-Button.",
  },
  {
    type: "announcement",
    label: "Ankündigung",
    icon: Megaphone,
    hint: "Kurze Neuigkeit ohne festen Termin.",
  },
  {
    type: "article",
    label: "Beitrag",
    icon: PenLine,
    hint: "Längerer Text mit Fotos und Zitaten.",
  },
];

function draftKey(isEditing: boolean, id?: string) {
  return isEditing ? `admin-post-draft:${id}` : "admin-post-draft:new";
}

// Nach einem erzwungenen Re-Login (abgelaufene Session) die zwischengespeicherten
// Eingaben wiederherstellen, statt dass der Beitrag neu geschrieben werden muss.
// Als lazy state-Initializer statt Effect, um kein zusätzliches Re-Render auszulösen.
function loadDraft(storageKey: string): Draft | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(storageKey);
  if (!raw) return null;
  sessionStorage.removeItem(storageKey);
  try {
    return JSON.parse(raw) as Draft;
  } catch {
    return null;
  }
}

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-base text-text-primary outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20";

const labelClass = "flex items-center gap-1.5 text-sm font-medium text-text-primary";

const sectionClass = "rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-black/5 sm:p-5";

export default function PostForm({ initialPost }: PostFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isEditing = Boolean(initialPost);
  const storageKey = draftKey(isEditing, initialPost?.id);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [draft] = useState(() => loadDraft(storageKey));

  const [type, setType] = useState<PostType>(draft?.type ?? initialPost?.type ?? "article");
  const [title, setTitle] = useState(draft?.title ?? initialPost?.title ?? "");
  const [slug, setSlug] = useState(draft?.slug ?? initialPost?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(draft?.slugTouched ?? isEditing);
  const [excerpt, setExcerpt] = useState(draft?.excerpt ?? initialPost?.excerpt ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    draft?.coverImageUrl ?? initialPost?.coverImageUrl ?? null,
  );
  const [coverImageAlt, setCoverImageAlt] = useState(
    draft?.coverImageAlt ?? initialPost?.coverImageAlt ?? "",
  );
  const [blocks, setBlocks] = useState<PostBlock[]>(draft?.blocks ?? initialPost?.blocks ?? []);
  const [eventDate, setEventDate] = useState(draft?.eventDate ?? initialPost?.eventDate ?? "");
  const [eventTime, setEventTime] = useState(draft?.eventTime ?? initialPost?.eventTime ?? "");
  const [eventLocation, setEventLocation] = useState(
    draft?.eventLocation ?? initialPost?.eventLocation ?? "",
  );
  const [eventCtaLabel, setEventCtaLabel] = useState(
    draft?.eventCtaLabel ?? initialPost?.eventCtaLabel ?? "",
  );
  const [eventCtaHref, setEventCtaHref] = useState(
    draft?.eventCtaHref ?? initialPost?.eventCtaHref ?? "",
  );
  const [status, setStatus] = useState<"draft" | "published">(
    draft?.status ?? initialPost?.status ?? "draft",
  );
  // Einmal beim Mounten gemerkt, damit Render-Durchläufe stabil bleiben.
  const [mountedAt] = useState(() => Date.now());
  const [publishedAt, setPublishedAt] = useState(
    () => draft?.publishedAt ?? toDateTimeLocalValue(initialPost?.publishedAt ?? Date.now()),
  );
  const [pinned, setPinned] = useState(draft?.pinned ?? initialPost?.pinned ?? false);

  const [slugCheck, setSlugCheck] = useState<{
    slug: string;
    available: boolean;
    suggestion: string;
  } | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const slugChanged = isEditing && slug !== initialPost?.slug;

  // Live-Prüfung der Link-Adresse, entprellt, damit nicht bei jedem
  // Tastendruck eine Anfrage rausgeht.
  useEffect(() => {
    if (!slug) return;

    const timeout = window.setTimeout(async () => {
      const params = new URLSearchParams({ slug });
      if (initialPost?.id) params.set("id", initialPost.id);

      try {
        const res = await fetch(`/api/admin/posts/slug-check?${params.toString()}`);
        const data = res.ok
          ? ((await res.json()) as { available: boolean; suggestion: string })
          : { available: true, suggestion: slug };
        setSlugCheck({ slug, ...data });
      } catch {
        // Bei Netzwerkproblemen nicht blockieren — der Server prüft beim
        // Speichern ohnehin erneut.
        setSlugCheck({ slug, available: true, suggestion: slug });
      }
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [slug, initialPost?.id]);

  // Abgeleitet statt als State gehalten: solange die Antwort nicht zum aktuell
  // eingegebenen Slug passt, läuft die Prüfung noch.
  const slugState: SlugState = !slug
    ? { status: "idle" }
    : slugCheck?.slug !== slug
      ? { status: "checking" }
      : slugCheck.available
        ? { status: "free" }
        : { status: "taken", suggestion: slugCheck.suggestion };

  function handleTitleChange(value: string) {
    setTitle(value);
    // Solange die Adresse nicht von Hand angepasst wurde, folgt sie dem Titel.
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleTypeChange(nextType: PostType) {
    setType(nextType);
    if (nextType !== "event") {
      setEventDate("");
      setEventTime("");
      setEventLocation("");
      setEventCtaLabel("");
      setEventCtaHref("");
    }
  }

  function currentDraft(): Draft {
    return {
      type,
      title,
      slug,
      slugTouched,
      excerpt,
      coverImageUrl,
      coverImageAlt,
      blocks,
      eventDate,
      eventTime,
      eventLocation,
      eventCtaLabel,
      eventCtaHref,
      status,
      publishedAt,
      pinned,
    };
  }

  function saveDraftAndRedirectToLogin() {
    sessionStorage.setItem(storageKey, JSON.stringify(currentDraft()));
    router.push(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setError(null);
    const result = await uploadImage(file);
    setUploadingCover(false);

    if (!result.ok) {
      if (result.unauthorized) {
        saveDraftAndRedirectToLogin();
        return;
      }
      setError(result.error);
      return;
    }

    setCoverImageUrl(result.url);
  }

  function validate(): string | null {
    if (!title.trim()) return "Bitte gib einen Titel ein.";
    if (!slug) return "Bitte gib eine Link-Adresse ein.";
    if (slugState.status === "taken") {
      return `Die Link-Adresse „${slug}“ ist bereits vergeben. Vorschlag: ${slugState.suggestion}`;
    }
    if (coverImageUrl && !coverImageAlt.trim()) {
      return "Bitte beschreibe das Titelbild im Alt-Text.";
    }
    const imageWithoutAlt = blocks.find(
      (block) => block.type === "image" && block.url && !block.alt.trim(),
    );
    if (imageWithoutAlt) return "Bitte gib für jedes Foto im Inhalt einen Alt-Text an.";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      type,
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      coverImageUrl,
      coverImageAlt: coverImageAlt.trim(),
      blocks,
      eventDate: type === "event" ? eventDate || null : null,
      eventTime: type === "event" ? eventTime || null : null,
      eventLocation: type === "event" ? eventLocation.trim() || null : null,
      eventCtaLabel: type === "event" ? eventCtaLabel.trim() || null : null,
      eventCtaHref: type === "event" ? eventCtaHref.trim() || null : null,
      status,
      publishedAt: new Date(publishedAt).getTime() || Date.now(),
      pinned,
    };

    let res: Response;
    try {
      res = await fetch(
        isEditing ? `/api/admin/posts/${initialPost!.id}` : "/api/admin/posts",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
    } catch {
      setSaving(false);
      setError("Speichern fehlgeschlagen. Bitte prüfe deine Internetverbindung.");
      return;
    }

    setSaving(false);

    if (res.status === 401) {
      saveDraftAndRedirectToLogin();
      return;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(
        data && typeof data.error === "string" ? data.error : "Speichern fehlgeschlagen.",
      );
      return;
    }

    sessionStorage.removeItem(storageKey);
    router.push("/admin");
    router.refresh();
  }

  const previewPost = {
    type,
    title: title || "Ohne Titel",
    coverImageUrl,
    coverImageAlt,
    blocks,
    eventDate: eventDate || null,
    eventTime: eventTime || null,
    eventLocation: eventLocation || null,
    eventCtaLabel: eventCtaLabel || null,
    eventCtaHref: eventCtaHref || null,
    publishedAt: new Date(publishedAt).getTime() || mountedAt,
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 pb-28 sm:pb-6">
        <section className={sectionClass}>
          <span className={labelClass}>Art des Beitrags</span>
          <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
            {TYPE_OPTIONS.map(({ type: optionType, label, icon: Icon }) => (
              <button
                key={optionType}
                type="button"
                onClick={() => handleTypeChange(optionType)}
                aria-pressed={type === optionType}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors ${
                  type === optionType
                    ? "border-sage bg-sage/10 text-sage"
                    : "border-black/10 bg-white text-text-secondary hover:bg-black/5"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-text-secondary">
            {TYPE_OPTIONS.find((option) => option.type === type)?.hint}
          </p>
        </section>

        <section className={sectionClass}>
          <label className={labelClass} htmlFor="title">
            <Type className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
            Titel
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className={fieldClass}
          />

          <div className="mt-4">
            <label className={labelClass} htmlFor="slug">
              <Link2 className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
              Link-Adresse
            </label>
            <input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className={fieldClass}
            />

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="break-all text-text-secondary">
                {SITE_URL.replace("https://", "")}/blog/{slug || "…"}
              </span>
              {slugState.status === "checking" && (
                <span className="inline-flex items-center gap-1 text-text-secondary">
                  <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
                  prüft…
                </span>
              )}
              {slugState.status === "free" && (
                <span className="inline-flex items-center gap-1 text-sage">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                  frei
                </span>
              )}
              {slugState.status === "taken" && (
                <button
                  type="button"
                  onClick={() => {
                    setSlugTouched(true);
                    setSlug(slugState.suggestion);
                  }}
                  className="inline-flex items-center gap-1 text-red-600 underline"
                >
                  <AlertCircle className="h-3 w-3" strokeWidth={2} />
                  vergeben — „{slugState.suggestion}“ übernehmen
                </button>
              )}
              {slugTouched && (
                <button
                  type="button"
                  onClick={() => {
                    setSlugTouched(false);
                    setSlug(slugify(title));
                  }}
                  className="inline-flex items-center gap-1 text-text-secondary underline"
                >
                  <RotateCcw className="h-3 w-3" strokeWidth={2} />
                  Zurücksetzen
                </button>
              )}
            </div>

            {slugChanged && (
              <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-gold/15 px-3 py-2 text-xs text-text-primary">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                Alte Links funktionieren danach nicht mehr.
              </p>
            )}
          </div>
        </section>

        <section className={sectionClass}>
          <label className={labelClass} htmlFor="excerpt">
            <Text className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
            Kurzbeschreibung
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value.slice(0, EXCERPT_MAX_LENGTH))}
            rows={3}
            maxLength={EXCERPT_MAX_LENGTH}
            className={`${fieldClass} resize-none`}
          />
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs text-text-secondary">
            <button
              type="button"
              onClick={() => setExcerpt(excerptFromBlocks(blocks))}
              className="underline"
            >
              Aus dem ersten Absatz übernehmen
            </button>
            <span>
              {excerpt.length}/{EXCERPT_MAX_LENGTH}
            </span>
          </div>
        </section>

        <section className={sectionClass}>
          <span className={labelClass}>
            <ImagePlus className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
            Titelbild
          </span>
          <p className="mt-1 text-xs text-text-secondary">
            Querformat 16:10 (z. B. 1600 × 1000 px), mindestens 1200 × 750 px.
          </p>

          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleCoverChange}
            className="hidden"
          />

          {coverImageUrl && (
            <div className="relative mt-3 overflow-hidden rounded-xl ring-1 ring-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImageUrl} alt="" className="h-44 w-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setCoverImageUrl(null);
                  if (coverInputRef.current) coverInputRef.current.value = "";
                }}
                aria-label="Titelbild entfernen"
                className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploadingCover}
            className="mt-3 flex min-h-11 items-center gap-2 rounded-xl border border-dashed border-sage/40 bg-sage/5 px-4 text-sm text-sage transition-colors hover:bg-sage/10 disabled:opacity-50"
          >
            {uploadingCover ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                Lädt hoch…
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" strokeWidth={1.75} />
                {coverImageUrl ? "Ersetzen" : "Foto auswählen"}
              </>
            )}
          </button>

          <div className="mt-3">
            <label className={labelClass} htmlFor="coverAlt">
              Alt-Text (beschreibt das Bild)
            </label>
            <input
              id="coverAlt"
              value={coverImageAlt}
              onChange={(e) => setCoverImageAlt(e.target.value)}
              placeholder="z. B. Silke im Gespräch mit einer Kundin"
              className={fieldClass}
            />
          </div>
        </section>

        {type === "event" && (
          <section className={sectionClass}>
            <span className={labelClass}>
              <CalendarDays className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
              Event-Details
            </span>

            <div className="mt-1.5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="eventDate">
                  <Calendar className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
                  Datum
                </label>
                <input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="eventTime">
                  <Clock className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
                  Uhrzeit (optional)
                </label>
                <input
                  id="eventTime"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass} htmlFor="eventLocation">
                <MapPin className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
                Ort
              </label>
              <input
                id="eventLocation"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="z. B. Hildisrieden, Praxis am Rhein"
                className={fieldClass}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="eventCtaLabel">
                  Button-Text
                </label>
                <input
                  id="eventCtaLabel"
                  value={eventCtaLabel}
                  onChange={(e) => setEventCtaLabel(e.target.value)}
                  placeholder="Jetzt anmelden"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="eventCtaHref">
                  Button-Link
                </label>
                <input
                  id="eventCtaHref"
                  value={eventCtaHref}
                  onChange={(e) => setEventCtaHref(e.target.value)}
                  placeholder="#kontakt oder https://…"
                  className={fieldClass}
                />
              </div>
            </div>
          </section>
        )}

        <section className={sectionClass}>
          <span className={labelClass}>
            <PenLine className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
            Inhalt
          </span>
          <p className="mt-1 mb-3 text-xs text-text-secondary">
            Setze die Bausteine in beliebiger Reihenfolge zusammen.
          </p>
          <BlockEditor
            blocks={blocks}
            onChange={setBlocks}
            onUnauthorized={saveDraftAndRedirectToLogin}
          />
        </section>

        <section className={sectionClass}>
          <span className={labelClass}>Veröffentlichung</span>

          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {(["draft", "published"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                aria-pressed={status === option}
                className={`min-h-11 rounded-xl border text-sm font-medium transition-colors ${
                  status === option
                    ? "border-sage bg-sage/10 text-sage"
                    : "border-black/10 bg-white text-text-secondary hover:bg-black/5"
                }`}
              >
                {option === "draft" ? "Entwurf" : "Veröffentlicht"}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className={labelClass} htmlFor="publishedAt">
              <CalendarDays className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
              Datum der Veröffentlichung
            </label>
            <input
              id="publishedAt"
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={fieldClass}
            />
            <p className="mt-1.5 text-xs text-text-secondary">
              Bestimmt die Reihenfolge — neuere Beiträge stehen oben.
            </p>
          </div>

          <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-5 w-5 accent-[#8faf8a]"
            />
            <Pin className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
            Oben anheften
          </label>
        </section>

        {error && (
          <p className="flex items-start gap-1.5 text-sm text-red-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
            {error}
          </p>
        )}

        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-black/5 bg-white/90 p-4 backdrop-blur-xl sm:static sm:border-0 sm:bg-transparent sm:p-0">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 sm:mx-0">
            <button
              type="submit"
              disabled={saving || uploadingCover}
              className="group relative flex min-h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-5 text-base font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 sm:flex-none"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              {saving && <Loader2 className="h-4.5 w-4.5 animate-spin" strokeWidth={2} />}
              {saving ? "Speichert…" : "Speichern"}
            </button>

            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-medium text-text-primary transition-colors hover:bg-black/5"
            >
              <Eye className="h-4 w-4" strokeWidth={1.75} />
              Vorschau
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="flex min-h-12 items-center justify-center rounded-full px-4 text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </form>

      {showPreview && (
        <PostPreview post={previewPost} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
}
