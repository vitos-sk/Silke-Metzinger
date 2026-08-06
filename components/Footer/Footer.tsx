import Image from "next/image";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/icons/BrandIcons";
import { ASSET_V } from "@/lib/assetVersion";
import { SOCIAL_PROFILES } from "@/lib/site";

const FOOTER_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
];

// Die Adressen stehen in lib/site.ts, weil die strukturierten Daten (sameAs)
// dieselben Profile nennen müssen wie der Footer.
const SOCIAL_LINKS = [
  { label: "Facebook", href: SOCIAL_PROFILES.facebook, icon: FacebookIcon },
  { label: "Instagram", href: SOCIAL_PROFILES.instagram, icon: InstagramIcon },
  { label: "LinkedIn", href: SOCIAL_PROFILES.linkedin, icon: LinkedInIcon },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-sage/6 text-text-secondary">
      <div className="relative h-px w-full bg-linear-to-r from-transparent via-gold/35 to-transparent">
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold/50" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <Image
            src={`/logo.png?v=${ASSET_V}`}
            alt="Silke Metzinger"
            width={949}
            height={312}
            className="h-11 w-auto"
          />
          <p className="max-w-sm text-sm">
            Ernährungsberaterin &amp; Coach für Gesundheit, Vitalstoffe und deinen
            persönlichen Weg zu mehr Energie und Balance.
          </p>
          <ul className="flex gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/10 text-sage ring-1 ring-sage/20 transition-colors hover:bg-sage/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm">Mitglied von:</p>
            <Image
              src={`/svnm.png?v=${ASSET_V}`}
              alt="SVNM – Schweizerischer Verband Network Marketing"
              width={1536}
              height={550}
              className="h-24 w-auto md:h-28"
            />
            <a
              href="https://svnm.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline underline-offset-4 hover:text-sage"
            >
              svnm.online
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center gap-4 border-t border-sage/15 pt-8 text-xs sm:flex-row sm:justify-between">
          <p>© {year} Silke Metzinger. Alle Rechte vorbehalten.</p>
          <ul className="flex gap-6">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-sage">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
