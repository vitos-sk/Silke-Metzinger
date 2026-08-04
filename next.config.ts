import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 liefert nur explizit erlaubte Qualitätsstufen aus. 90 nutzen wir
    // für Beitragsbilder, damit Fotos in den Karten scharf bleiben.
    qualities: [75, 90],
    // Erlaubt Query-Strings (z. B. ?v=5) auf lokalen /public-Bildern,
    // die wir fuers Cache-Busting an die Foto-URLs anhaengen.
    // Ohne "search" ist jeder Query-String erlaubt. Frueher war "search" exakt
    // an ASSET_V gekoppelt – dann brach jede ASSET_V-Aenderung den Dev-Server,
    // weil Next Aenderungen in Config-Imports nicht neu einliest.
    localPatterns: [{ pathname: "/**" }],
    // Blog-Bilder liegen im Vercel Blob Storage.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
