"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Eye, EyeOff, Loader2, Lock, Mail, Save } from "lucide-react";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-base text-text-primary outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20";

const labelClass = "flex items-center gap-1.5 text-sm font-medium text-text-primary";

const sectionClass = "rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-black/5 sm:p-5";

const PASSWORD_MIN_LENGTH = 8;

export default function AccountForm({ initialEmail }: { initialEmail: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setJustSaved(false);

    const emailChanged = email.trim().toLowerCase() !== initialEmail.toLowerCase();
    const wantsNewPassword = newPassword.length > 0;

    if (!emailChanged && !wantsNewPassword) {
      setError("Bitte E-Mail oder Passwort ändern.");
      return;
    }

    if (wantsNewPassword && newPassword !== repeatPassword) {
      setError("Die neuen Passwörter stimmen nicht überein.");
      return;
    }

    if (wantsNewPassword && newPassword.length < PASSWORD_MIN_LENGTH) {
      setError(`Das neue Passwort braucht mindestens ${PASSWORD_MIN_LENGTH} Zeichen.`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          email: emailChanged ? email : undefined,
          newPassword: wantsNewPassword ? newPassword : undefined,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Speichern fehlgeschlagen.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
      setJustSaved(true);
      router.refresh();
    } catch {
      setError("Speichern fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="font-serif text-lg text-text-primary sm:text-xl">Zugang</h2>
        <p className="text-xs text-text-secondary sm:text-sm">
          E-Mail und Passwort für die Anmeldung im Admin-Bereich.
        </p>
      </div>

      <div className={sectionClass}>
        <label className={labelClass} htmlFor="account-email">
          <Mail className="h-4 w-4 text-sage" strokeWidth={1.75} />
          E-Mail
        </label>
        <input
          id="account-email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setJustSaved(false);
          }}
          className={fieldClass}
        />
      </div>

      <div className={`${sectionClass} space-y-4`}>
        <div>
          <label className={labelClass} htmlFor="account-current-password">
            <Lock className="h-4 w-4 text-sage" strokeWidth={1.75} />
            Aktuelles Passwort
          </label>
          <input
            id="account-current-password"
            type={showPasswords ? "text" : "password"}
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setJustSaved(false);
            }}
            className={fieldClass}
          />
          <p className="mt-1.5 text-xs text-text-secondary">
            Zur Bestätigung — auch wenn nur die E-Mail geändert wird.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="account-new-password">
            <Lock className="h-4 w-4 text-sage" strokeWidth={1.75} />
            Neues Passwort
          </label>
          <input
            id="account-new-password"
            type={showPasswords ? "text" : "password"}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setJustSaved(false);
            }}
            className={fieldClass}
          />
          <p className="mt-1.5 text-xs text-text-secondary">
            Leer lassen, wenn das Passwort gleich bleiben soll · mindestens{" "}
            {PASSWORD_MIN_LENGTH} Zeichen.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="account-repeat-password">
            <Lock className="h-4 w-4 text-sage" strokeWidth={1.75} />
            Neues Passwort wiederholen
          </label>
          <input
            id="account-repeat-password"
            type={showPasswords ? "text" : "password"}
            autoComplete="new-password"
            value={repeatPassword}
            onChange={(e) => {
              setRepeatPassword(e.target.value);
              setJustSaved(false);
            }}
            className={fieldClass}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowPasswords((v) => !v)}
          className="flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          {showPasswords ? (
            <EyeOff className="h-4 w-4" strokeWidth={1.75} />
          ) : (
            <Eye className="h-4 w-4" strokeWidth={1.75} />
          )}
          {showPasswords ? "Passwörter verbergen" : "Passwörter anzeigen"}
        </button>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}

      {justSaved && !error && (
        <p className="flex items-center gap-1.5 text-sm text-sage">
          <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
          Zugangsdaten gespeichert. Beim nächsten Login gelten die neuen Daten.
        </p>
      )}

      <button
        type="submit"
        disabled={saving || !currentPassword}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-5 py-3.5 text-sm font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
      >
        <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
        ) : (
          <Save className="h-4 w-4" strokeWidth={2} />
        )}
        {saving ? "Speichern…" : "Zugangsdaten speichern"}
      </button>
    </form>
  );
}
