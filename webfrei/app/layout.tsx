import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Bebas Neue via Google Fonts CDN (loaded in head manually for display font)
// We use a CSS import approach for Bebas Neue
export const metadata: Metadata = {
  title: "WebFrei – Webentwickler in Freiburg | Websites die verkaufen",
  description:
    "Full-Stack Webentwickler aus Freiburg. Moderne, schnelle Websites für kleine und mittlere Unternehmen – SEO-optimiert, individuell entwickelt, ab 799€.",
  keywords: [
    "Webentwickler Freiburg",
    "Website erstellen Freiburg",
    "Freelancer Webdesign Freiburg",
    "Homepage erstellen lassen",
    "Full-Stack Developer Freiburg",
    "Next.js Entwickler",
    "WebFrei",
  ],
  authors: [{ name: "Vitaliy – WebFrei" }],
  creator: "Vitaliy – WebFrei",
  metadataBase: new URL("https://webfrei.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "WebFrei – Webentwickler in Freiburg",
    description:
      "Websites die Kunden gewinnen. Full-Stack Entwicklung, SEO-optimiert, mobile-first.",
    url: "https://webfrei.com",
    siteName: "WebFrei",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebFrei – Webentwickler in Freiburg",
    description: "Websites die Kunden gewinnen.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "WebFrei",
              description:
                "Full-Stack Webentwickler in Freiburg. Professionelle Websites für Unternehmen.",
              url: "https://webfrei.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Freiburg im Breisgau",
                addressRegion: "Baden-Württemberg",
                addressCountry: "DE",
              },
              priceRange: "€€",
              openingHours: "Mo-Fr 09:00-18:00",
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
