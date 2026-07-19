"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sessionExpired = searchParams.get("next") !== null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    let res: Response;
    try {
      res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
    } catch {
      setLoading(false);
      setError("Verbindung fehlgeschlagen. Bitte prüfe deine Internetverbindung.");
      return;
    }

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Falsches Passwort.");
      return;
    }

    const next = searchParams.get("next");
    router.push(next && next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30">
            <ShieldCheck className="h-6 w-6 text-ivory" strokeWidth={1.75} />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-3xl bg-white/70 p-6 shadow-xl shadow-text-primary/10 ring-1 ring-black/5 backdrop-blur-xl sm:p-8"
        >
          <h1 className="font-serif text-2xl text-text-primary">Admin-Login</h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Zugang zur Verwaltung von News &amp; Events.
          </p>

          {sessionExpired && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span>
                Deine Sitzung ist abgelaufen. Bitte melde dich erneut an – deine Eingaben wurden
                zwischengespeichert.
              </span>
            </p>
          )}

          <label className="mt-6 block text-sm font-medium text-text-primary" htmlFor="password">
            Passwort
          </label>
          <div className="relative mt-1.5">
            <Lock
              className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-text-secondary"
              strokeWidth={1.75}
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white py-3.5 pl-10.5 pr-11 text-base text-text-primary outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
              className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-black/5 hover:text-text-primary"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" strokeWidth={1.75} />
              ) : (
                <Eye className="h-4.5 w-4.5" strokeWidth={1.75} />
              )}
            </button>
          </div>

          {error && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-4 py-3.5 text-base font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
          >
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            {loading && <Loader2 className="h-4.5 w-4.5 animate-spin" strokeWidth={2} />}
            {loading ? "Anmelden…" : "Anmelden"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
