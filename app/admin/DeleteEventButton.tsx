"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteEventButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Dieses Event wirklich löschen?")) return;
    setLoading(true);
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-600 hover:opacity-80 disabled:opacity-50"
    >
      Löschen
    </button>
  );
}
