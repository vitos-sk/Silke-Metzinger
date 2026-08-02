"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, MailOpen, Trash2 } from "lucide-react";

export default function SubmissionActions({
  id,
  read,
  label,
}: {
  id: string;
  read: boolean;
  label: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"read" | "delete" | null>(null);

  async function toggleRead() {
    setLoading("read");
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !read }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      router.refresh();
    } catch {
      alert("Aktualisieren fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setLoading(null);
    }
  }

  async function handleDelete() {
    if (!confirm(`Anfrage von "${label}" wirklich löschen?`)) return;
    setLoading("delete");
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      router.refresh();
    } catch {
      alert("Löschen fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        onClick={toggleRead}
        disabled={loading !== null}
        aria-label={read ? "Als ungelesen markieren" : "Als gelesen markieren"}
        title={read ? "Als ungelesen markieren" : "Als gelesen markieren"}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-sage transition-colors hover:bg-sage/10 disabled:opacity-50"
      >
        {loading === "read" ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
        ) : read ? (
          <MailOpen className="h-4 w-4" strokeWidth={1.75} />
        ) : (
          <Mail className="h-4 w-4" strokeWidth={1.75} />
        )}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading !== null}
        aria-label="Anfrage löschen"
        title="Anfrage löschen"
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        {loading === "delete" ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
        ) : (
          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}
