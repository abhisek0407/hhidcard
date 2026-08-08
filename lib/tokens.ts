
/**
 * Brand tokens for Hacker House Goa 2026.
 * Hexes sampled from the official site and the task announcement card.
 * Swap these (and only these) if the official brand kit differs.
 */
export const C = {
  green: "#0B6839",
  deep: "#063F22",
  cream: "#FFFBE8",
  pink: "#FF0080",
  ink: "#08210F",
} as const;

export const DISPLAY =
  '"Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif';
export const MONO =
  '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

export const HASHTAG = "#FrameInGoa";
export const EVENT_DATES = "28\u201331 OCT 2026";
export const COHORT = 247;

export const CAPTION =
  "I'm in the frame for Hacker House Goa 2026.\n" +
  "28\u201331 Oct \u00b7 Goa \u00b7 247 builders, one house.\n\n" +
  HASHTAG;

/** Frame colourways, named after the four days on the HH Goa agenda. */
export type Colorway = {
  id: string;
  label: string;
  ring: string;
  accent: string;
  text: string;
};

export const COLORWAYS: Colorway[] = [
  { id: "genesis", label: "Genesis", ring: C.green, accent: C.pink, text: C.cream },
  { id: "triangle", label: "Triangle", ring: C.deep, accent: C.cream, text: C.cream },
  { id: "build", label: "Build", ring: C.cream, accent: C.pink, text: C.ink },
  { id: "launch", label: "Launch", ring: C.pink, accent: C.cream, text: C.cream },
];

export const byId = (id: string): Colorway =>
  COLORWAYS.find((c) => c.id === id) ?? COLORWAYS[0];

/**
 * Embedded as a real tEXt chunk in every exported PNG — see lib/png-meta.ts.
 * Invisible in the image, readable by any PNG metadata tool (exiftool,
 * `identify -verbose`, browser devtools network inspector, etc). If this
 * text shows up in someone else's submission, it wasn't their build.
 */
export const SIGNATURE: Record<string, string> = {
  Author: "Krishna \u2014 github.com/KrishnaaCodeWala",
  Software: "Frame In Goa \u2014 HH Goa 2026",
  Source: "https://github.com/KrishnaaCodeWala/framein-goa",
  Comment: "KRISHNA IS THE BEST \u2014 original build for HH Goa 2026 Task #1.",
};
