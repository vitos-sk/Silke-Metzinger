"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Falsches Passwort.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="font-serif text-2xl text-text-primary">Admin-Login</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Zugang zur Verwaltung von News &amp; Events.
        </p>

        <label className="mt-6 block text-sm text-text-primary" htmlFor="password">
          Passwort
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-black/10 px-3 py-2 text-text-primary outline-none focus:border-sage"
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-sage px-4 py-2.5 text-ivory transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Anmelden…" : "Anmelden"}
        </button>
      </form>
    </main>
  );
}
