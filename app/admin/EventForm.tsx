"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { NewsEvent } from "@/types/event";

interface EventFormProps {
  initialEvent?: NewsEvent;
}

export default function EventForm({ initialEvent }: EventFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialEvent);

  const [title, setTitle] = useState(initialEvent?.title ?? "");
  const [date, setDate] = useState(initialEvent?.date ?? "");
  const [description, setDescription] = useState(initialEvent?.description ?? "");
  const [link, setLink] = useState(initialEvent?.link ?? "");
  const [order, setOrder] = useState(initialEvent?.order ?? 0);
  const [imageUrl, setImageUrl] = useState<string | null>(initialEvent?.imageUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    setUploading(false);

    if (!res.ok) {
      setError("Foto-Upload fehlgeschlagen.");
      return;
    }

    const data = await res.json();
    setImageUrl(data.url);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { title, date, description, link: link || null, imageUrl, order: Number(order) };

    const res = await fetch(
      isEditing ? `/api/admin/events/${initialEvent!.id}` : "/api/admin/events",
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    setSaving(false);

    if (!res.ok) {
      setError("Speichern fehlgeschlagen.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <label className="block text-sm text-text-primary" htmlFor="title">
          Titel
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1.5 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-sage"
        />
      </div>

      <div>
        <label className="block text-sm text-text-primary" htmlFor="date">
          Datum (z. B. 12. September 2026)
        </label>
        <input
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1.5 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-sage"
        />
      </div>

      <div>
        <label className="block text-sm text-text-primary" htmlFor="description">
          Kurzbeschreibung
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
          className="mt-1.5 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-sage"
        />
      </div>

      <div>
        <label className="block text-sm text-text-primary" htmlFor="link">
          Link (optional, z. B. zur Anmeldung)
        </label>
        <input
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="#kontakt"
          className="mt-1.5 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-sage"
        />
      </div>

      <div>
        <label className="block text-sm text-text-primary" htmlFor="order">
          Reihenfolge (kleinere Zahl zuerst)
        </label>
        <input
          id="order"
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="mt-1.5 w-32 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-sage"
        />
      </div>

      <div>
        <label className="block text-sm text-text-primary" htmlFor="photo">
          Foto
        </label>
        <input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="mt-1.5" />
        {uploading && <p className="mt-1 text-sm text-text-secondary">Lädt hoch…</p>}
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="mt-3 h-32 w-auto rounded-lg object-cover" />
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploading}
        className="rounded-full bg-sage px-5 py-2.5 text-sm text-ivory transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Speichert…" : "Speichern"}
      </button>
    </form>
  );
}
