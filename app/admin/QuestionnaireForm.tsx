"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Mail, Save } from "lucide-react";
import { NAME_PLACEHOLDER, type Questionnaire } from "@/types/questionnaire";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-base text-text-primary outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20";

const labelClass = "flex items-center gap-1.5 text-sm font-medium text-text-primary";

const sectionClass = "rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-black/5 sm:p-5";

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export default function QuestionnaireForm({ initial }: { initial: Questionnaire }) {
  const router = useRouter();
  const [subject, setSubject] = useState(initial.subject);
  const [intro, setIntro] = useState(initial.intro);
  const [questions, setQuestions] = useState<string[]>(initial.questions);
  const [outro, setOutro] = useState(initial.outro);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(
    initial.updatedAt > 0 ? initial.updatedAt : null,
  );
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateQuestion(index: number, value: string) {
    setQuestions((current) => current.map((item, i) => (i === index ? value : item)));
    setJustSaved(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/questionnaire", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, intro, questions, outro }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Speichern fehlgeschlagen.");
        return;
      }

      setSavedAt(data.updatedAt ?? Date.now());
      setJustSaved(true);
      router.refresh();
    } catch {
      setError("Speichern fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setSaving(false);
    }
  }

  const filledCount = questions.filter((question) => question.trim()).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg text-text-primary sm:text-xl">
            15 Reflexionsfragen
          </h2>
          <p className="text-xs text-text-secondary sm:text-sm">
            {filledCount} von {questions.length} Fragen ausgefüllt
            {savedAt ? ` · zuletzt gespeichert am ${formatDate(savedAt)}` : ""}
          </p>
        </div>
      </div>

      <section className={sectionClass}>
        <label className={labelClass} htmlFor="questionnaire-subject">
          <Mail className="h-4 w-4 text-text-secondary" strokeWidth={1.75} />
          Betreff der E-Mail
        </label>
        <input
          id="questionnaire-subject"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            setJustSaved(false);
          }}
          required
          className={fieldClass}
        />

        <div className="mt-4">
          <label className={labelClass} htmlFor="questionnaire-intro">
            Einleitung
          </label>
          <textarea
            id="questionnaire-intro"
            value={intro}
            onChange={(e) => {
              setIntro(e.target.value);
              setJustSaved(false);
            }}
            rows={5}
            className={fieldClass}
          />
          <p className="mt-1.5 text-xs text-text-secondary">
            <code className="rounded bg-black/5 px-1 py-0.5">{NAME_PLACEHOLDER}</code> wird beim
            Versand durch den Namen der Empfängerin ersetzt.
          </p>
        </div>
      </section>

      <section className={sectionClass}>
        <span className={labelClass}>Die Fragen</span>
        <p className="mt-1 text-xs text-text-secondary">
          Leere Zeilen werden in der E-Mail einfach weggelassen.
        </p>
        <div className="mt-3 space-y-2.5">
          {questions.map((question, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <span className="mt-3.5 w-6 shrink-0 text-right text-sm text-text-secondary">
                {index + 1}.
              </span>
              <textarea
                value={question}
                onChange={(e) => updateQuestion(index, e.target.value)}
                rows={2}
                aria-label={`Frage ${index + 1}`}
                className={`${fieldClass} mt-0 resize-y`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <label className={labelClass} htmlFor="questionnaire-outro">
          Abschluss
        </label>
        <textarea
          id="questionnaire-outro"
          value={outro}
          onChange={(e) => {
            setOutro(e.target.value);
            setJustSaved(false);
          }}
          rows={5}
          className={fieldClass}
        />
      </section>

      {error && (
        <p className="rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-sage px-5 text-sm font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
          ) : (
            <Save className="h-4 w-4" strokeWidth={1.75} />
          )}
          Vorlage speichern
        </button>
        {justSaved && !saving && (
          <span className="flex items-center gap-1.5 text-sm text-sage">
            <Check className="h-4 w-4" strokeWidth={2} />
            Gespeichert
          </span>
        )}
      </div>
    </form>
  );
}
