/**
 * Header — HH Goa logo, date stamp, and tagline.
 * Stateless — purely presentational.
 */
export function Header() {
  return (
    <>
      <header className="flex items-start justify-between gap-[14px] mb-[22px]">
        <div className="leading-[0.92]">
          <b className="block font-bold text-[30px] tracking-[-0.03em]">HH GOA</b>
          <span className="text-lg opacity-85" lang="hi">
            गोवा
          </span>
        </div>
        <div className="font-mono text-[9.5px] leading-relaxed text-right tracking-[0.14em] uppercase text-cream/62 border-l border-cream/22 pl-[10px] flex-none">
          28–31 OCT 2026
          <br />
          Goa, India
          <br />
          <em className="not-italic text-pink">247 builders</em>
        </div>
      </header>
      <p className="font-mono text-xs leading-relaxed text-cream/72 -mt-2 mb-[22px]">
        Drop a photo. Get your frame. Post it with <strong>#FrameInGoa</strong>.
      </p>
    </>
  );
}