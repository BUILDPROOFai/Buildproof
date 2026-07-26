import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",      // page background
        panel: "#F7F8FB",      // card / section background
        line: "#E7E9F0",       // hairline borders
        ink: "#101423",        // primary text — near-black navy
        muted: "#666B7A",      // secondary text
        verified: "#17A34A",   // status: on track
        flagged: "#D97706",    // status: needs attention
        risk: "#DC2626",       // status: delayed
        seal: "#3457E0",       // brand accent — CTAs, links, mark
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "sans-serif"],
        display: ["var(--font-grotesk)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
