/**
 * TeamModeTabs — "Individual photos" / "Group photo" subtab toggle.
 */
import type { TeamMode } from "../config";

export function TeamModeTabs(props: {
  teamMode: TeamMode;
  onChange: (mode: TeamMode) => void;
}) {
  const active = "flex-1 appearance-none border-0 bg-green text-cream font-mono text-[10.5px] font-bold tracking-[0.05em] uppercase px-[4px] py-[9px] rounded-lg cursor-pointer tab-transition";
  const inactive =
  "flex-1 appearance-none border-0 bg-transparent text-ink/55 font-mono text-[10.5px] font-bold tracking-[0.05em] uppercase px-[4px] py-[9px] rounded-lg cursor-pointer tab-transition hover:bg-green/10 hover:text-green";

  return (
    <div className="flex gap-[6px] bg-green/[0.06] p-1 rounded-xl mb-[14px]" role="group" aria-label="Team photo style">
      <button
        className={props.teamMode === "individual" ? active : inactive}
        aria-pressed={props.teamMode === "individual"}
        onClick={() => props.onChange("individual")}
      >
        Individual photos
      </button>
      <button
        className={props.teamMode === "group" ? active : inactive}
        aria-pressed={props.teamMode === "group"}
        onClick={() => props.onChange("group")}
      >
        Group photo
      </button>
    </div>
  );
}