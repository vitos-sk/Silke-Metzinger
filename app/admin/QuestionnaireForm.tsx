"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Mail, Plus, Save, Trash2 } from "lucide-react";
import {
  MAX_QUESTIONS,
  MIN_QUESTIONS,
  NAME_PLACEHOLDER,
  type Questionnaire,
} from "@/types/questionnaire";

// Zeilen brauchen eine stabile ID: Beim Löschen mitten in der Liste würde ein
// Index-Key den Inhalt der folgenden Felder verrutschen lassen.
interface QuestionRow {
  id: number;
  text: string;
}

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
  const [rows, setRows] = useState<QuestionRow[]>(() =>
    initial.questions.map((text, index) => ({ id: index, text })),
  );
  const nextId = useRef(initial.questions.length);

  function makeRows(texts: string[]): QuestionRow[] {
    return texts.map((text) => ({ id: nextId.current++, text }));
  }
  const [outro, setOutro] = useState(initial.outro);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(
    initial.updatedAt > 0 ? initial.updatedAt : null,
  );
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateQuestion(id: number, value: string) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, text: value } : row)));
    setJustSaved(false);
  }

  function addQuestion() {
    setRows((current) =>
      current.length >= MAX_QUESTIONS
        ? current
        : [...current, { id: nextId.current++, text: "" }],
    );
    setJustSaved(false);
  }

  function removeQuestion(id: number) {
    setRows((current) =>
      current.length <= MIN_QUESTIONS ? current : current.filter((row) => row.id !== id),
    );
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
        body: JSON.stringify({
          subject,
          intro,
          questions: rows.map((row) => row.text),
          outro,
        }),
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

      // Der Server wirft leere Zeilen weg — das Formular übernimmt danach den
      // gespeicherten Stand, damit die Anzahl hier und auf der Website gleich ist.
      if (Array.isArray(data.questions)) {
        setRows(makeRows(data.questions as string[]));
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

  const filledCount = rows.filter((row) => row.text.trim()).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg text-text-primary sm:text-xl">
            {filledCount} Reflexionsfragen
          </h2>
          <p className="text-xs text-text-secondary sm:text-sm">
            {filledCount} von {rows.length} Fragen ausgefüllt
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
          Die Anzahl steuerst du hier: Zeilen hinzufügen oder löschen. Genau diese
          Zahl steht auf der Website („{filledCount} Reflexionsfragen für mehr
          Klarheit“). Leere Zeilen werden beim Speichern verworfen.
        </p>
        <div className="mt-3 space-y-2.5">
          {rows.map((row, index) => (
            <div key={row.id} className="flex items-start gap-2.5">
              <span className="mt-3.5 w-6 shrink-0 text-right text-sm text-text-secondary">
                {index + 1}.
              </span>
              <textarea
                value={row.text}
                onChange={(e) => updateQuestion(row.id, e.target.value)}
                rows={2}
                aria-label={`Frage ${index + 1}`}
                className={`${fieldClass} mt-0 resize-y`}
              />
              <button
                type="button"
                onClick={() => removeQuestion(row.id)}
                disabled={rows.length <= MIN_QUESTIONS}
                aria-label={`Frage ${index + 1} löschen`}
                title="Frage löschen"
                className="mt-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 pl-8.5">
          <button
            type="button"
            onClick={addQuestion}
            disabled={rows.length >= MAX_QUESTIONS}
            className="flex min-h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-medium text-text-primary shadow-sm ring-1 ring-black/10 transition-colors hover:bg-sage/10 hover:text-sage disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Frage hinzufügen
          </button>
          <span className="text-xs text-text-secondary">
            {rows.length >= MAX_QUESTIONS
              ? `Maximal ${MAX_QUESTIONS} Fragen.`
              : `${rows.length} von maximal ${MAX_QUESTIONS} Fragen`}
          </span>
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
