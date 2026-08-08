/**
 * RotateControl — "↺ Rotate" button cycling 0°→90°→180°→270°→0°.
 */
const LABELS = ["0°", "90°", "180°", "270°"];

export function RotateControl(props: {
  rotation: number;
  onChange: (r: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 mt-[14px]">
      <span className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase text-ink/55 flex-none">
        Rotate
      </span>
      <button
        className="appearance-none border-0 rounded-xl px-4 py-[10px] cursor-pointer font-mono text-[10.5px] font-bold tracking-[0.06em] uppercase bg-green/12 text-ink/80 hover:bg-green/20 transition-[background] duration-180"
        onClick={() => props.onChange((props.rotation + 1) % 4)}
        aria-label="Rotate image 90 degrees clockwise"
      >
        ↺ {LABELS[props.rotation]}
      </button>
    </div>
  );
}