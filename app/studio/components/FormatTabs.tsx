/**
 * FormatTabs — profile / builder ID / banner / team switcher.
 */
import type { Mode } from "../config";
import { TABS } from "../config";

export function FormatTabs(props: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  return (
    <div className="flex gap-1 bg-black/22 p-[5px] rounded-full mb-[18px]" role="tablist" aria-label="Format">
      {TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={props.mode === t.id}
          onClick={() => props.onChange(t.id)}
          className="flex-1 appearance-none border-0 bg-transparent text-cream/66 font-mono text-[10.5px] font-bold tracking-[0.06em] uppercase px-[2px] py-[11px] rounded-full cursor-pointer tab-transition aria-selected:bg-pink aria-selected:text-white"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}