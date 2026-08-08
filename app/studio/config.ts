/**
 * Frame In Goa — HH Goa 2026 — local types and constants for the Studio UI.
 * Extracted from the monolithic Studio.tsx. Zero logic — values only.
 */

export type Mode = "pfp" | "id" | "banner" | "team";
export type TeamMode = "individual" | "group";

export type FilterPreset = "none" | "warm" | "mono" | "vivid";

export const FILTER_MAP: Record<FilterPreset, string> = {
  none: "",
  warm: "sepia(0.35) saturate(1.15)",
  mono: "grayscale(1) contrast(1.1)",
  vivid: "saturate(1.4) contrast(1.15)",
};

export const FILTER_LABELS: Record<FilterPreset, string> = {
  none: "None",
  warm: "Warm",
  mono: "Mono",
  vivid: "Vivid",
};

export const PREVIEW = 900;
export const ACCEPT = "image/*,.heic,.heif,.HEIC,.HEIF";
export const MAX_TEAM = 3;

export const TABS: { id: Mode; label: string }[] = [
  { id: "pfp", label: "Profile" },
  { id: "id", label: "Builder ID" },
  { id: "banner", label: "Banner" },
  { id: "team", label: "Team" },
];