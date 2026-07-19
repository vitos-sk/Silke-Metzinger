"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteEventButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${title}" wirklich löschen?`)) return;
    setLoading(true);

    let res: Response;
    try {
      res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    } catch {
      setLoading(false);
      alert("Löschen fehlgeschlagen. Bitte prüfe deine Internetverbindung.");
      return;
    }

    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }

    setLoading(false);

    if (!res.ok) {
      alert("Löschen fehlgeschlagen. Bitte versuche es erneut.");
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      aria-label="Event löschen"
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
      ) : (
        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
      )}
      <span className="hidden sm:inline">Löschen</span>
    </button>
  );
}
