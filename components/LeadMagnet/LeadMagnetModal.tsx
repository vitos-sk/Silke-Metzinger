"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Mail, Send, User, X } from "lucide-react";
import { HoneypotField } from "@/components/ui/HoneypotField";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

type Status = "idle" | "sending" | "success" | "error";

export default function LeadMagnetModal({
  open,
  onClose,
  count,
  label,
}: {
  open: boolean;
  onClose: () => void;
  count: number;
  label: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          consent: formData.get("consent") === "on",
          [HONEYPOT_FIELD]: formData.get(HONEYPOT_FIELD),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Etwas ist schiefgelaufen.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    }
  }

  function handleClose() {
    setStatus("idle");
    setErrorMessage("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-magnet-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-ivory p-6 shadow-xl ring-1 ring-sage/20 sm:p-8"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-sage via-gold to-sage"
            />

            <button
              type="button"
              onClick={handleClose}
              aria-label="Schließen"
              className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-sage/10 hover:text-sage"
            >
              <X className="h-5 w-5" />
            </button>

            <h2
              id="lead-magnet-title"
              className="pr-8 font-serif text-2xl text-text-primary"
            >
              Hol dir die {count} {label}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Trag dich ein und du erhältst die {count} {label} kostenlos per
              E-Mail.
            </p>

            {status === "success" ? (
              <p className="mt-6 rounded-2xl bg-sage/10 px-4 py-4 text-sm text-sage">
                Danke für deine Anfrage! Du erhältst die {count} {label} in
                Kürze per E-Mail.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="relative mt-6 space-y-4">
                <HoneypotField />

                <div className="group relative">
                  <input
                    id="lead-fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder=" "
                    className="peer w-full rounded-2xl border border-sage/25 bg-white py-3 pl-12 pr-4 text-text-primary shadow-sm outline-none transition-all duration-300 placeholder:text-transparent focus:border-sage focus:shadow-[0_0_0_4px_rgba(143,175,138,0.15)]"
                  />
                  <User className="pointer-events-none absolute left-4 top-4 text-text-secondary/50 transition-colors duration-300 peer-focus:text-sage" />
                  <label
                    htmlFor="lead-fullName"
                    className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 rounded bg-white px-1 text-text-secondary transition-all duration-300 peer-focus:top-0 peer-focus:left-4 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:text-sage peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:left-4 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:scale-75"
                  >
                    Vorname &amp; Nachname
                  </label>
                </div>

                <div className="group relative">
                  <input
                    id="lead-email"
                    name="email"
                    type="email"
                    required
                    placeholder=" "
                    className="peer w-full rounded-2xl border border-sage/25 bg-white py-3 pl-12 pr-4 text-text-primary shadow-sm outline-none transition-all duration-300 placeholder:text-transparent focus:border-sage focus:shadow-[0_0_0_4px_rgba(143,175,138,0.15)]"
                  />
                  <Mail className="pointer-events-none absolute left-4 top-4 text-text-secondary/50 transition-colors duration-300 peer-focus:text-sage" />
                  <label
                    htmlFor="lead-email"
                    className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 rounded bg-white px-1 text-text-secondary transition-all duration-300 peer-focus:top-0 peer-focus:left-4 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:text-sage peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:left-4 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:scale-75"
                  >
                    E-Mail-Adresse
                  </label>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-sage/20 bg-white/70 px-4 py-3 text-sm text-text-secondary shadow-sm transition-colors hover:border-sage/40">
                  <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="peer absolute inset-0 h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-sage/40 transition-colors checked:border-sage checked:bg-sage"
                    />
                    <Check className="pointer-events-none h-3.5 w-3.5 text-ivory opacity-0 transition-opacity peer-checked:opacity-100" />
                  </span>
                  Ich stimme der Datenschutzerklärung zu.
                </label>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-8 py-3.5 text-ivory shadow-md ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(143,175,138,0.4)] disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  />
                  <span className="relative">
                    {status === "sending" ? "Wird gesendet …" : "Kostenlos anfordern"}
                  </span>
                  <Send className="relative h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                {status === "error" && (
                  <p className="text-sm text-red-600">{errorMessage}</p>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
