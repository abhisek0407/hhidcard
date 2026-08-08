import { COHORT } from "./tokens";

/** FNV-1a. Deterministic, so the same person always gets the same badge. */
export function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const ADJECTIVES = [
  "Midnight", "Terminal", "Salt-Crusted", "Relentless", "Caffeinated",
  "Offline", "Barefoot", "Rogue", "Quiet", "Sunrise", "Feral", "Unblocked",
];

const NOUNS = [
  "Shipper", "Debugger", "Architect", "Operator", "Tinkerer", "Closer",
  "Cartographer", "Mechanic", "Builder", "Nomad", "Wrangler", "Sorcerer",
];

/**
 * Generated locally rather than by a model call. A round trip would cost
 * a second and an API key to produce something no better than this.
 */
export function builderTitle(seed: string): string {
  const h = hash(seed || "goa");
  return `${ADJECTIVES[h % ADJECTIVES.length]} ${NOUNS[(h >> 5) % NOUNS.length]}`;
}

/** Badge number out of the 247 seats. */
export function residentNo(seed: string): string {
  return String((hash(seed || "goa") % COHORT) + 1).padStart(3, "0");
}
