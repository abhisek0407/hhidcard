import {
  DEFAULT_FOCUS,
  drawCover,
  fitFont,
  gridPattern,
  type Drawable,
} from "../canvas";
import { C, DISPLAY, EVENT_DATES, HASHTAG, MONO } from "../tokens";

export const TEAM_EXPORT = 1200;

export type Member = { img: Drawable };

/**
 * One post, everyone in the same ring. The task asks for the frame to travel
 * from a solo selfie to a combined team post, so the ring geometry here is
 * deliberately the same one used in the profile frame.
 */
export function drawTeam(
  ctx: CanvasRenderingContext2D,
  S: number,
  members: Member[],
  names: string[],
) {
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = C.green;
  ctx.fillRect(0, 0, S, S);

  const grid = gridPattern(ctx, S * 0.06, "rgba(255,251,232,.09)");
  if (grid) {
    ctx.fillStyle = grid;
    ctx.fillRect(0, 0, S, S);
  }

  const n = members.length;

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.cream;
  ctx.font = `700 ${S * 0.075}px ${DISPLAY}`;
  ctx.fillText("HH GOA 2026", S / 2, S * 0.135);

  ctx.fillStyle = C.pink;
  ctx.font = `700 ${S * 0.026}px ${MONO}`;
  ctx.fillText(
    n === 1 ? "ONE BUILDER, ONE FRAME" : `${n} BUILDERS, ONE FRAME`,
    S / 2,
    S * 0.178,
  );

  if (n === 0) {
    ctx.fillStyle = "rgba(255,251,232,.35)";
    ctx.font = `400 ${S * 0.032}px ${MONO}`;
    ctx.fillText("ADD YOUR TEAM BELOW", S / 2, S * 0.53);
  } else {
    /**
     * Each row occupies its circle plus the name caption beneath it. Sizing
     * from that unit — rather than from the circle alone — is what keeps a
     * two-row grid from pushing its bottom captions into the footer.
     */
    const cols = n <= 2 ? n : 2;
    const rows = Math.ceil(n / cols);
    const top = S * 0.21;
    const avail = S * 0.65;
    const unit = 1.22; // circle + caption, as a multiple of cell
    const gapRatio = 0.14;
    const cell = Math.min(
      S * 0.34,
      avail / (rows * unit + (rows - 1) * gapRatio),
    );
    const gapX = S * 0.045;
    const rowStride = cell * (unit + gapRatio);
    const blockH = rows * cell * unit + (rows - 1) * cell * gapRatio;
    const startY = top + (avail - blockH) / 2;

    members.forEach((member, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const inRow = Math.min(cols, n - row * cols);
      const rowW = inRow * cell + (inRow - 1) * gapX;
      const x = (S - rowW) / 2 + col * (cell + gapX);
      const y = startY + row * rowStride;
      const r = cell / 2;
      const ccx = x + r;
      const ccy = y + r;

      ctx.save();
      ctx.beginPath();
      ctx.arc(ccx, ccy, r * 0.855, 0, Math.PI * 2);
      ctx.clip();
      drawCover(ctx, member.img, ccx - r, ccy - r, cell, cell, DEFAULT_FOCUS);
      ctx.restore();

      ctx.lineWidth = cell * 0.052;
      ctx.strokeStyle = C.cream;
      ctx.beginPath();
      ctx.arc(ccx, ccy, r * 0.882, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = cell * 0.02;
      ctx.strokeStyle = C.pink;
      ctx.beginPath();
      ctx.arc(ccx, ccy, r * 0.955, 0, Math.PI * 2);
      ctx.stroke();

      const name = (names[i] ?? "").trim();
      if (name) {
        ctx.fillStyle = C.cream;
        ctx.textAlign = "center";
        ctx.font = fitFont(ctx, name.toUpperCase(), cell * 1.05, cell * 0.115, 700, MONO);
        ctx.fillText(name.toUpperCase(), ccx, ccy + r + cell * 0.16);
      }
    });
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,251,232,.45)";
  ctx.font = `400 ${S * 0.022}px ${MONO}`;
  ctx.fillText(`${EVENT_DATES} \u00b7 GOA, INDIA`, S / 2, S * 0.905);

  ctx.fillStyle = C.cream;
  ctx.font = `700 ${S * 0.034}px ${MONO}`;
  ctx.fillText(HASHTAG, S / 2, S * 0.945);

  ctx.textAlign = "left";
}
