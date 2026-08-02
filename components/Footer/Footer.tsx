import Image from "next/image";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/icons/BrandIcons";
import { ASSET_V } from "@/lib/assetVersion";

const FOOTER_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/19LsGR6kfm/?mibextid=wwXIfr",
    icon: FacebookIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/silke_metzinger_?igsh=bDd1dDF1YWQwY2Fz&utm_source=qr",
    icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/silke-metzinger",
    icon: LinkedInIcon,
  },
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
            <a
              href="https://svnm.online"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SVNM – Schweizerischer Verband Network Marketing"
              className="inline-block overflow-hidden rounded-xl ring-1 ring-sage/15 transition-opacity duration-300 hover:opacity-80"
            >
              <Image
                src={`/svnm.png?v=${ASSET_V}`}
                alt="SVNM – Schweizerischer Verband Network Marketing"
                width={1536}
                height={550}
                className="h-24 w-auto md:h-28"
              />
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
