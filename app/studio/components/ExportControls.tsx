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
      {/* Share to X */}
      <button
        type="button"
        disabled={!props.canAct}
        onClick={props.onShare}
        className="appearance-none border-0 rounded-xl px-4 py-4 cursor-pointer font-mono text-xs font-bold tracking-[0.1em] uppercase text-center no-underline active:translate-y-px transition-transform duration-120 disabled:opacity-40 disabled:cursor-not-allowed bg-pink text-white"
      >
        Share to X
      </button>

      {/* Download */}
      <button
        type="button"
        disabled={!props.canAct}
        onClick={props.onDownload}
        className="appearance-none border-0 rounded-xl px-4 py-4 cursor-pointer font-mono text-xs font-bold tracking-[0.1em] uppercase text-center no-underline active:translate-y-px transition-transform duration-120 disabled:opacity-40 disabled:cursor-not-allowed bg-green text-white"
      >
        Download Image
      </button>

      {/* Different photo */}
      {props.onDifferentPhoto && (
        <button
          type="button"
          onClick={props.onDifferentPhoto}
          className="appearance-none border-0 bg-transparent rounded-xl px-4 py-3 cursor-pointer font-mono text-xs font-bold tracking-[0.1em] uppercase text-center text-ink/55 hover:text-pink transition-colors duration-180"
        >
          Use a different photo
        </button>
      )}
    </div>
  );
}