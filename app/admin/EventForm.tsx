"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  ImagePlus,
  Link2,
  Loader2,
  Minus,
  Plus,
  Text,
  Type,
  X,
} from "lucide-react";
import type { NewsEvent } from "@/types/event";

interface EventFormProps {
  initialEvent?: NewsEvent;
}

interface Draft {
  title: string;
  date: string;
  description: string;
  link: string;
  order: number;
  imageUrl: string | null;
}

function draftKey(isEditing: boolean, id?: string) {
  return isEditing ? `admin-event-draft:${id}` : "admin-event-draft:new";
}

// Nach einem erzwungenen Re-Login (abgelaufene Session) die zwischengespeicherten
// Eingaben wiederherstellen, statt dass der Nutzer die News neu abtippen muss.
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

export default function EventForm({ initialEvent }: EventFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isEditing = Boolean(initialEvent);
  const storageKey = draftKey(isEditing, initialEvent?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [draft] = useState(() => loadDraft(storageKey));

  const [title, setTitle] = useState(draft?.title ?? initialEvent?.title ?? "");
  const [date, setDate] = useState(draft?.date ?? initialEvent?.date ?? "");
  const [description, setDescription] = useState(draft?.description ?? initialEvent?.description ?? "");
  const [link, setLink] = useState(draft?.link ?? initialEvent?.link ?? "");
  const [order, setOrder] = useState(draft?.order ?? initialEvent?.order ?? 1);
  const [imageUrl, setImageUrl] = useState<string | null>(
    draft?.imageUrl ?? initialEvent?.imageUrl ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otherEvents, setOtherEvents] = useState<NewsEvent[]>([]);

  useEffect(() => {
    fetch("/api/admin/events")
      .then((res) => (res.ok ? (res.json() as Promise<NewsEvent[]>) : []))
      .then((events) => setOtherEvents(events.filter((ev) => ev.id !== initialEvent?.id)))
      .catch(() => {});
  }, [initialEvent?.id]);

  const orderConflict = otherEvents.find((ev) => ev.order === Number(order));

  function saveDraftAndRedirectToLogin() {
    const draft: Draft = { title, date, description, link, order, imageUrl };
    sessionStorage.setItem(storageKey, JSON.stringify(draft));
    router.push(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    let res: Response;
    try {
      res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    } catch {
      setUploading(false);
      setError("Foto-Upload fehlgeschlagen. Bitte prüfe deine Internetverbindung.");
      return;
    }

    setUploading(false);

    if (res.status === 401) {
      saveDraftAndRedirectToLogin();
      return;
    }

    if (!res.ok) {
      setError("Foto-Upload fehlgeschlagen.");
      return;
    }

    const data = await res.json();
    setImageUrl(data.url);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!imageUrl) {
      setError("Bitte lade ein Foto hoch.");
      return;
    }

    if (orderConflict) {
      setError(
        `Reihenfolge ${order} ist bereits von „${orderConflict.title}“ belegt. Bitte wähle eine andere Zahl.`,
      );
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title,
      date: date || null,
      description,
      link: link || null,
      imageUrl,
      order: Number(order),
    };

    let res: Response;
    try {
      res = await fetch(
        isEditing ? `/api/admin/events/${initialEvent!.id}` : "/api/admin/events",
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
      setError("Speichern fehlgeschlagen.");
      return;
    }

    sessionStorage.removeItem(storageKey);
    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-5 rounded-2xl bg-white/70 p-4 pb-24 shadow-sm ring-1 ring-black/5 backdrop-blur-xl sm:p-6 sm:pb-6"
    >
      <div>
        <label className={labelClass} htmlFor="title">
          <Type className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
          Titel
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="date">
          <Calendar className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
          Datum (optional, z. B. 12. September 2026)
        </label>
        <input
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          <Text className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
          Kurzbeschreibung
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="link">
          <Link2 className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
          Link (optional, z. B. zur Anmeldung)
        </label>
        <input
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="#kontakt"
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="order">
          <ArrowUpDown className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
          Reihenfolge (kleinere Zahl zuerst)
        </label>
        <div
          className={`mt-1.5 flex w-32 items-stretch overflow-hidden rounded-xl border bg-white transition-colors focus-within:ring-2 ${
            orderConflict
              ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-200"
              : "border-black/10 focus-within:border-sage focus-within:ring-sage/20"
          }`}
        >
          <button
            type="button"
            onClick={() => setOrder((o) => Math.max(1, o - 1))}
            aria-label="Reihenfolge verringern"
            className="flex w-10 shrink-0 items-center justify-center text-text-secondary transition-colors hover:bg-black/5 active:bg-black/10"
          >
            <Minus className="h-4 w-4" strokeWidth={2} />
          </button>
          <input
            id="order"
            type="number"
            inputMode="numeric"
            min={1}
            value={order}
            onChange={(e) => setOrder(e.target.value === "" ? 1 : Number(e.target.value))}
            onFocus={(e) => e.target.select()}
            className="w-full border-0 bg-transparent py-3 text-center text-base text-text-primary outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setOrder((o) => o + 1)}
            aria-label="Reihenfolge erhöhen"
            className="flex w-10 shrink-0 items-center justify-center text-text-secondary transition-colors hover:bg-black/5 active:bg-black/10"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        {orderConflict && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            Platz {order} ist schon von „{orderConflict.title}&ldquo; belegt.
          </p>
        )}
      </div>

      <div>
        <span className={labelClass}>
          <ImagePlus className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
          Foto (erforderlich)
        </span>
        <p className="mt-1 text-xs text-text-secondary">
          Querformat, Seitenverhältnis 16:10 (z. B. 1600 × 1000 px), mind. 1200 × 750 px
        </p>

        <input
          ref={fileInputRef}
          id="photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mt-1.5 flex items-center gap-4">
          {imageUrl && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setImageUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                aria-label="Foto entfernen"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
              >
                <X className="h-3 w-3" strokeWidth={2} />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-xl border border-dashed border-sage/40 bg-sage/5 px-4 py-3 text-sm text-sage transition-colors hover:bg-sage/10 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                Lädt hoch…
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" strokeWidth={1.75} />
                {imageUrl ? "Foto ersetzen" : "Foto auswählen"}
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-black/5 bg-white/90 p-4 backdrop-blur-xl sm:static sm:border-0 sm:bg-transparent sm:p-0">
        <div className="mx-auto max-w-3xl sm:mx-0">
          <button
            type="submit"
            disabled={saving || uploading || Boolean(orderConflict)}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-5 py-3.5 text-base font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
          >
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            {saving && <Loader2 className="h-4.5 w-4.5 animate-spin" strokeWidth={2} />}
            {saving ? "Speichert…" : "Speichern"}
          </button>
        </div>
      </div>
    </form>
  );
}
