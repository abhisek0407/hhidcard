/**
 * ExportControls — Share to X, Download, and "Use a different photo" buttons.
 */
export function ExportControls(props: {
  canAct: boolean;
  onShare: () => void;
  onDownload: () => void;
  onDifferentPhoto: (() => void) | null;
}) {
  return (
    <div className="grid gap-[10px] mt-4">
      <button
        className="appearance-none border-0 rounded-xl px-4 py-4 cursor-pointer font-mono text-xs font-bold tracking-[0.1em] uppercase text-center no-underline active:translate-y-px transition-transform duration-120 disabled:opacity-40 disabled:cursor-not-allowed bg-pink text-white"
        disabled={!props.canAct}
        onClick={() => props.onShare()}
      >
        Share to X
      </button>
      <button
        className="appearance-none border-0 rounded-xl px-4 py-4 cursor-pointer font-mono text-xs font-bold tracking-[0.1em] uppercase text-center no-underline active:translate-y-px transition-transform duration-120 disabled:opacity-40 disabled:cursor-not-allowed bg-green text-cream"
        disabled={!props.canAct}
        onClick={() => props.onDownload()}
      >
        Download image
      </button>
      {props.onDifferentPhoto && (
        <button
          className="appearance-none border-0 rounded-xl px-4 py-3 cursor-pointer font-mono text-xs font-bold tracking-[0.1em] uppercase text-center no-underline active:translate-y-px transition-transform duration-120 disabled:opacity-40 disabled:cursor-not-allowed bg-transparent text-ink/55 border border-green/25"
          onClick={props.onDifferentPhoto}
        >
          Use a different photo
        </button>
      )}
    </div>
  );
}