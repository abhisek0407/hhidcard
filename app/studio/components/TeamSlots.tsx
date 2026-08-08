/**
 * TeamSlots — 3x3 add/remove photo grid + team names input.
 */
const inputCls =
  "w-full font-display text-base text-ink bg-white border border-green/28 rounded-xl px-[13px] py-3 focus:outline-none focus:border-pink focus:shadow-[0_0_0_3px_rgba(255,0,128,0.16)]";

export function TeamSlots(props: {
  teamCount: number;
  maxTeam: number;
  onAddSlot: () => void;
  onRemoveSlot: (index: number) => void;
  teamNames: string;
  onTeamNamesChange: (v: string) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-3 gap-2 mt-[14px]">
        {Array.from({ length: props.maxTeam }, (_, i) => i).map((i) => {
          const filled = i < props.teamCount;
          return (
            <button
              key={i}
              className={
                filled
                  ? "aspect-square rounded-xl border border-solid border-pink bg-pink/10 text-pink font-mono text-xl cursor-pointer"
                  : "aspect-square rounded-xl border border-dashed border-green/38 bg-green/[0.05] font-mono text-xl text-green/45 cursor-pointer"
              }
              onClick={() => {
                if (filled) props.onRemoveSlot(i);
                else props.onAddSlot();
              }}
              aria-label={filled ? `Remove photo ${i + 1}` : `Add photo ${i + 1}`}
            >
              {filled ? "\u00d7" : "+"}
            </button>
          );
        })}
      </div>
      <div className="grid gap-3 mt-4">
        <div>
          <label htmlFor="tNames" className="block font-mono text-[10px] font-bold tracking-[0.12em] uppercase text-ink/55 mb-[6px]">
            Names, separated by commas
          </label>
          <input id="tNames" maxLength={60} placeholder="Krishna, Aisha, Dev"
            value={props.teamNames}
            onChange={(e) => props.onTeamNamesChange(e.target.value)}
            className={inputCls} />
        </div>
      </div>
    </>
  );
}