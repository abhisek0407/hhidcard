
export const C = {
  green: "#087F6A",
  deep: "#073B32",
  cream: "#FFF3D6",
  pink: "#FF6B5A",
  ink: "#102A27",
  sun: "#FFD166",
} as const;

export const DISPLAY =
  '"Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif';

export const MONO =
  '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

export const HASHTAG = "#FrameInGoa";
export const EVENT_DATES = "28–31 OCT 2026";
export const COHORT = 247;

export const CAPTION =
  "🌴 Just got my Hacker House Goa 2026 frame!\n\n" +
  "Ready to build, ship, and connect with amazing builders in Goa. 🚀\n\n" +
  "28–31 Oct · Goa, India 🇮🇳\n" +
  "247 builders. 4 days. One house.\n\n" +
  "Create your own frame and join us!\n\n" +
  "#HHGoa2026 #FrameInGoa #BuildInPublic";

/**
 * Frame colourways.
 */
export type Colorway = {
  id: string;
  label: string;
  ring: string;
  accent: string;
  text: string;
};

export const COLORWAYS: Colorway[] = [
  {
    id: "tide",
    label: "Tide",
    ring: "#087F6A",
    accent: "#FFD166",
    text: "#FFF3D6",
  },

  {
    id: "forest",
    label: "Forest",
    ring: "#073B32",
    accent: "#FF6B5A",
    text: "#FFF3D6",
  },

  {
    id: "sunset",
    label: "Sunset",
    ring: "#D96B45",
    accent: "#FFD166",
    text: "#FFF3D6",
  },

  {
    id: "coral",
    label: "Coral",
    ring: "#FF6B5A",
    accent: "#073B32",
    text: "#FFF3D6",
  },
];

export const byId = (id: string): Colorway =>
  COLORWAYS.find((c) => c.id === id) ?? COLORWAYS[0];

/**
 * Metadata for exported PNGs.
 *
 * Replace the values below with your team's actual repository/details.
 */
export const SIGNATURE: Record<string, string> = {
  Author: "Abhisek-github.com/abhisek0407",
  Software: "Frame In Goa — HH Goa 2026",
  Source: "https://github.com/abhisek0407/hhidcard",
  Comment: "HH Goa 2026 Task #1 — team build.",
};