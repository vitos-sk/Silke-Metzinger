"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Send } from "lucide-react";

export default function SendQuestionsButton({
  id,
  name,
  email,
  sentAt,
}: {
  id: string;
  name: string;
  email: string;
  sentAt: number | null;
}) {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  async function handleSend() {
    const question = sentAt
      ? `Die 15 Fragen wurden bereits verschickt. Noch einmal an ${email} senden?`
      : `Die 15 Reflexionsfragen an ${name} (${email}) senden?`;
    if (!confirm(question)) return;

    setSending(true);
    try {
      const res = await fetch(`/api/admin/submissions/${id}/send-questions`, {
        method: "POST",
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error ?? "Versand fehlgeschlagen. Bitte versuche es erneut.");
        return;
      }

      router.refresh();
    } catch {
      alert("Versand fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setSending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSend}
      disabled={sending}
      title={sentAt ? "Fragen erneut senden" : "Die 15 Fragen senden"}
      className={`flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors disabled:opacity-50 ${
        sentAt
          ? "bg-white text-text-secondary ring-1 ring-black/10 hover:bg-black/5"
          : "bg-sage text-ivory hover:bg-sage/90"
      }`}
    >
      {sending ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
      ) : sentAt ? (
        <Check className="h-4 w-4" strokeWidth={2} />
      ) : (
        <Send className="h-4 w-4" strokeWidth={1.75} />
      )}
      {sentAt ? "Erneut senden" : "Fragen senden"}
    </button>
  );
}
