import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Erlaubt Query-Strings (z. B. ?v=2) auf lokalen /public-Bildern,
    // die wir fuers Cache-Busting an die Foto-URLs anhaengen.
    localPatterns: [{ pathname: "/**" }],
  },
};

export default nextConfig;
