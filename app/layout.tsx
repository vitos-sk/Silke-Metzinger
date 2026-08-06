import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Cormorant } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MotionProvider from "@/components/motion/MotionProvider";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Nur 500: font-script wird ausschliesslich für Zitate genutzt, ein zweiter
// Schnitt (600) wurde geladen, aber nie gesetzt.
// Playfair und Inter bleiben ohne "weight" — next/font lädt dann die Variable
// Font als eine Datei, was günstiger ist als mehrere feste Schnitte.
const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  display: "swap",
});

const DESCRIPTION =
  "Ernährungsberatung, Resilienz-Coaching und persönliche Begleitung mit Silke Metzinger in Hildisrieden bei Luzern. Mehr Energie, mehr Leichtigkeit, mehr Klarheit für dein bestes Leben.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Unterseiten setzen nur ihren eigenen Titel; der Name kommt automatisch dazu.
    default: "Ernährungsberatung & Resilienz-Coaching Luzern | Silke Metzinger",
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${SITE_URL}/blog/feed.xml` },
  },
  openGraph: {
    // Das Vorschaubild liefert app/opengraph-image.tsx — hier bewusst kein "images".
    title: "Silke Metzinger — Vital & Frei",
    description: DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "de_CH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silke Metzinger — Vital & Frei",
    description: DESCRIPTION,
  },
  // Wert kommt aus den Vercel-Umgebungsvariablen, sobald die Domain in der
  // Google Search Console angemeldet ist.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  // Kein maximumScale/userScalable: Zoom zu sperren kostet Punkte bei der
  // Barrierefreiheit und erschwert das Lesen auf kleinen Displays.
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      // de-CH statt de: Hauptstandort und Schreibweise (ss statt ß) sind schweizerisch.
      lang="de-CH"
      // Next erkennt daran, dass das sanfte Scrollen gewollt ist, und schaltet
      // es bei Routenwechseln ab — sonst "gleitet" die neue Seite nach oben.
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-ivory text-text-primary">
        <MotionProvider>{children}</MotionProvider>
        {/* Beide messen ohne Cookies — die Datenschutzerklärung bleibt unberührt.
            Speed Insights liefert die Core Web Vitals echter Besucher, die
            Google als Ranking-Signal verwendet. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
