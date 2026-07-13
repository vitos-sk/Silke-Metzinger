"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Check, Mail, MessageSquare, Send, User } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from "@/components/icons/BrandIcons";
import { Reveal } from "@/components/motion/Reveal";

type Status = "idle" | "sending" | "success" | "error";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "LinkedIn", href: "#", icon: LinkedInIcon },
];

function FloatingField({
  id,
  name,
  label,
  icon,
  type = "text",
  as = "input",
  rows,
}: {
  id: string;
  name: string;
  label: string;
  icon: ReactNode;
  type?: string;
  as?: "input" | "textarea";
  rows?: number;
}) {
  const fieldClassName =
    "peer w-full rounded-2xl border border-sage/25 bg-white py-3 pl-12 pr-4 text-text-primary outline-none transition-all duration-300 placeholder:text-transparent focus:border-sage focus:shadow-[0_0_0_4px_rgba(143,175,138,0.15)]";

  const labelClassName =
    "pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 rounded bg-white px-1 text-text-secondary transition-all duration-300 peer-focus:top-0 peer-focus:left-4 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:text-sage peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:left-4 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:scale-75";

  const iconClassName =
    "pointer-events-none absolute left-4 top-4 text-text-secondary/50 transition-colors duration-300 peer-focus:text-sage";

  return (
    <div className="group relative">
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required
          rows={rows ?? 4}
          placeholder=" "
          className={`${fieldClassName} min-h-30 resize-y`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required
          placeholder=" "
          className={fieldClassName}
        />
      )}
      <span className={iconClassName}>{icon}</span>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
    </div>
  );
}

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          message: formData.get("message"),
          consent: formData.get("consent") === "on",
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

  return (
    <section id="kontakt" className="scroll-mt-32 bg-ivory px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center font-serif text-3xl text-text-primary md:text-4xl">
            Lass uns gemeinsam ins Gespräch kommen
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-text-secondary">
            Du möchtest mehr über meine Begleitung, Gesundheit, Vitalstoffe
            oder deinen persönlichen Weg zu mehr Energie und Balance
            erfahren? Ich freue mich darauf, von dir zu hören.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <Reveal
            direction="left"
            className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-sage/15 sm:p-8"
          >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FloatingField
                id="firstName"
                name="firstName"
                label="Vorname"
                icon={<User className="h-5 w-5" />}
              />
              <FloatingField
                id="lastName"
                name="lastName"
                label="Nachname"
                icon={<User className="h-5 w-5" />}
              />
            </div>

            <FloatingField
              id="email"
              name="email"
              type="email"
              label="E-Mail-Adresse"
              icon={<Mail className="h-5 w-5" />}
            />

            <FloatingField
              id="message"
              name="message"
              label="Deine Nachricht"
              as="textarea"
              icon={<MessageSquare className="h-5 w-5" />}
            />

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-sage/20 px-4 py-3 text-sm text-text-secondary transition-colors hover:border-sage/40">
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
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-sage px-8 py-3.5 text-ivory shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(143,175,138,0.4)] disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none sm:w-auto"
            >
              {status === "sending" ? "Wird gesendet …" : "Senden"}
              <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {status === "success" && (
              <p className="text-sm text-sage">
                Danke für deine Nachricht! Ich melde mich bald bei dir.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </form>
          </Reveal>

          <Reveal direction="right" className="space-y-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <img
                src="/silke-photo-contact.jpg"
                alt="Silke Metzinger – Ernährungsberaterin & Coach"
                className="h-36 w-36 rounded-full object-cover ring-4 ring-gold md:h-54 md:w-54"
              />
              <div>
                <p className="font-serif text-xl text-text-primary md:text-2xl">
                  Silke Metzinger
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Ernährungsberaterin & Coach
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg text-text-primary">
                Direktkontakt
              </h3>
              <ul className="mt-4 space-y-3 text-text-secondary">
                <li className="flex items-center gap-3">
                  <WhatsAppIcon className="h-5 w-5 text-sage" />
                  WhatsApp Deutschland: +49 173 340 1477
                </li>
                <li className="flex items-center gap-3">
                  <WhatsAppIcon className="h-5 w-5 text-sage" />
                  WhatsApp Schweiz: +41 76 630 3682
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-sage" />
                  <a
                    href="mailto:info.silke-metzinger@gmx.ch"
                    className="hover:text-sage"
                  >
                    info.silke-metzinger@gmx.ch
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg text-text-primary">
                Social Media
              </h3>
              <ul className="mt-4 flex gap-3">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-sage/10 text-sage ring-1 ring-sage/20 transition-colors hover:bg-sage/20"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
