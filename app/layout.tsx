import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://silke-metzinger.ch"),
  title: "Silke Metzinger — Vital & Frei",
  description:
    "Ernährungsberatung, Resilienzcoaching und persönliche Begleitung mit Silke Metzinger. Mehr Energie, mehr Leichtigkeit, mehr Klarheit für dein bestes Leben.",
  openGraph: {
    title: "Silke Metzinger — Vital & Frei",
    description:
      "Ernährungsberatung, Resilienzcoaching und persönliche Begleitung mit Silke Metzinger.",
    images: ["/og-image.jpg"],
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-ivory text-text-primary">
        {children}
      </body>
    </html>
  );
}
