import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // Tropical Goa palette
        green: "#087F6A",
        deep: "#073B32",
        cream: "#FFF3D6",
        pink: "#FF6B5A",
        ink: "#102A27",
        sun: "#FFD166",
      },

      fontFamily: {
        display: [
          '"Space Grotesk"',
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "sans-serif",
        ],

        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
    },
  },

  plugins: [],
} satisfies Config;