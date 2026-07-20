import type { NextConfig } from "next";
import { ASSET_V } from "./lib/assetVersion";

const nextConfig: NextConfig = {
  images: {
    // Erlaubt Query-Strings (z. B. ?v=2) auf lokalen /public-Bildern,
    // die wir fuers Cache-Busting an die Foto-URLs anhaengen.
    // "search" muss exakt matchen, daher an ASSET_V gekoppelt.
    localPatterns: [{ pathname: "/**", search: `?v=${ASSET_V}` }],
  },
};

export default nextConfig;
