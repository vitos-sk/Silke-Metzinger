import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F4EFE3",
        dark: "#111111",
        orange: "#E8451E",
        "orange-hover": "#CC3A18",
        muted: "#6B6B65",
        border: "rgba(17,17,17,0.1)",
        "border-light": "rgba(255,255,255,0.1)",
      },
      fontFamily: {
        heading: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(4rem,12vw,10rem)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(3rem,8vw,7rem)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem,5vw,4.5rem)", { lineHeight: "1", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        DEFAULT: "0px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
