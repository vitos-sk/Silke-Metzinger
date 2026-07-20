import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Cormorant } from "next/font/google";
import MotionProvider from "@/components/motion/MotionProvider";
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

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-ivory text-text-primary">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
