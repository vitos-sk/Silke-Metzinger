export const SITE_URL = "https://silke-metzinger.ch";

export const SITE_NAME = "Silke Metzinger";

// Erzeugt von app/opengraph-image.tsx. Für <meta>-Tags setzt Next den Pfad
// selbst — diese Konstante wird nur dort gebraucht, wo eine absolute Bild-URL
// von Hand gebaut werden muss (z. B. in JSON-LD).
export const OG_IMAGE_PATH = "/opengraph-image";

export const CONTACT_EMAIL = "info.silke-metzinger@gmx.ch";

// Eine Quelle für Footer, Impressum-Verweise und die strukturierten Daten:
// Google gleicht Name, Adresse und Telefonnummer über Websites hinweg ab,
// deshalb dürfen diese Angaben nirgends auseinanderlaufen.
export const LOCATIONS = [
  {
    id: "ch",
    street: "Luzernerstr. 17b",
    postalCode: "6204",
    city: "Hildisrieden",
    region: "Luzern",
    country: "CH",
    phone: "+41766303682",
    phoneDisplay: "076 630 36 82",
  },
  {
    id: "de",
    street: "Falkensteinerstrasse 1",
    postalCode: "79369",
    city: "Wyhl",
    region: "Baden-Württemberg",
    country: "DE",
    phone: "+491734301477",
    phoneDisplay: "0173 4301477",
  },
] as const;

export const SOCIAL_PROFILES = {
  facebook: "https://www.facebook.com/share/19LsGR6kfm/?mibextid=wwXIfr",
  instagram:
    "https://www.instagram.com/silke_metzinger_?igsh=bDd1dDF1YWQwY2Fz&utm_source=qr",
  linkedin: "https://linkedin.com/in/silke-metzinger",
} as const;
