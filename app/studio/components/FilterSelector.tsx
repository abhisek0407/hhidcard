/**
 * FilterSelector — photo filter preset buttons (None / Warm / Mono / Vivid).
 * Visual pattern matches ColorwaySelector — a row of compact buttons.
 */
import { type FilterPreset, FILTER_MAP, FILTER_LABELS } from "../config";
import type { ChangeEvent } from "react";

const presets: FilterPreset[] = ["none", "warm", "mono", "vivid"];

export function FilterSelector(props: {
  value: FilterPreset;
  onChange: (v: FilterPreset) => void;
}) {
  return (
    <div className="flex gap-[6px] mt-[14px]" role="group" aria-label="Photo filter">
      {presets.map((p) => (
        <button
          key={p}
          className={
            props.value === p
              ? "flex-1 appearance-none border-2 border-pink rounded-xl px-[2px] py-[10px] font-mono text-[9.5px] font-bold tracking-[0.06em] uppercase cursor-pointer bg-white text-ink transition-[background,border-color] duration-180"
              : "flex-1 appearance-none border-2 border-transparent rounded-xl px-[2px] py-[10px] font-mono text-[9.5px] font-bold tracking-[0.06em] uppercase cursor-pointer bg-green/8 text-ink/70 hover:bg-green/16 transition-[background,border-color] duration-180"
          }
          onClick={() => props.onChange(p)}
          aria-pressed={props.value === p}
        >
          {FILTER_LABELS[p]}
        </button>
      ))}
    </div>
  );
}