import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: "#0B6839",
        deep: "#063F22",
        cream: "#FFFBE8",
        pink: "#FF0080",
        ink: "#08210F",
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