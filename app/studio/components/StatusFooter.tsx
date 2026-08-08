/**
 * StatusFooter — manual share link + status/render-ms note at the bottom of the editor card.
 */
export function StatusFooter(props: {
  manualLink: string | null;
  status: string | null;
  renderMs: number | null;
}) {
  return (
    <>
      {props.manualLink && (
        <a
          className="appearance-none border-0 rounded-xl px-4 py-4 cursor-pointer font-mono text-xs font-bold tracking-[0.1em] uppercase text-center no-underline active:translate-y-px transition-transform duration-120 disabled:opacity-40 disabled:cursor-not-allowed bg-pink text-white block mt-[10px]"
          href={props.manualLink}
          target="_blank"
          rel="noopener"
        >
          Open X with the caption →
        </a>
      )}
      <p className={props.status ? "font-mono text-[10.5px] leading-relaxed text-pink mt-3" : "font-mono text-[10.5px] leading-relaxed text-ink/55 mt-3"}>
        {props.status ??
          (props.renderMs !== null
            ? `Rendered in ${props.renderMs}ms · exports a real PNG`
            : "Exports a real PNG.")}
      </p>
    </>
  );
}