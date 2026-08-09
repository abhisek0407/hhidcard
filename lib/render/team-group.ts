import {
  drawCover,
  drawGoaBackground,
  rr,
  type Drawable,
  type Focus,
} from "../canvas";
import { C, DISPLAY, EVENT_DATES, HASHTAG, MONO } from "../tokens";
import { drawQRCode, QR_URL } from "./qr";

export const GROUP_EXPORT = 1200;

/** x/y are fractions (0..1) of the canvas, so tags map identically at any export size. */
export type NameTag = { id: string; text: string; x: number; y: number };

/**
 * The "already-together" case: one real photo of the whole team, framed like
 * the other team format but without trying to segment faces out of it. Name
 * tags are drawn separately (see drawNameTags) so the interactive drag/edit
 * experience can live in plain HTML while the export stays canvas-only.
 */
export function drawTeamGroup(
  ctx: CanvasRenderingContext2D,
  S: number,
  image: Drawable | null,
  focus: Focus,
  filter = "",
) {
  ctx.clearRect(0, 0, S, S);

  drawGoaBackground(ctx, S, S);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.cream;
  ctx.font = `700 ${S * 0.072}px ${DISPLAY}`;
  ctx.fillText("HH GOA 2026", S / 2, S * 0.112);
  ctx.fillStyle = C.pink;
  ctx.font = `700 ${S * 0.024}px ${MONO}`;
  ctx.fillText("ONE FRAME, WHOLE CREW", S / 2, S * 0.15);

  const m = S * 0.07;
  const panelY = S * 0.185;
  const panelH = S * 0.62;
  const panelW = S - m * 2;

  ctx.save();
  rr(ctx, m, panelY, panelW, panelH, S * 0.03);
  ctx.clip();
  if (image) {
    drawCover(ctx, image, m, panelY, panelW, panelH, focus, filter);
  } else {
    ctx.fillStyle = C.deep;
    ctx.fillRect(m, panelY, panelW, panelH);
  }
  ctx.restore();

  ctx.lineWidth = S * 0.006;
  ctx.strokeStyle = C.pink;
  rr(ctx, m, panelY, panelW, panelH, S * 0.03);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,251,232,.45)";
  ctx.font = `400 ${S * 0.02}px ${MONO}`;
  ctx.fillText(`${EVENT_DATES} \u00b7 GOA, INDIA`, S / 2, S * 0.935);
  ctx.fillStyle = C.cream;
  ctx.font = `700 ${S * 0.03}px ${MONO}`;
  ctx.fillText(HASHTAG, S / 2, S * 0.972);
}

/**
 * Bakes the translucent name-tag pills into the export at their stored
 * fractional positions. Deliberately export-only — the live preview shows
 * these as real, draggable HTML elements instead (see Studio.tsx), which is
 * a far better editing experience than hit-testing text inside a canvas.
 */
export function drawNameTags(
  ctx: CanvasRenderingContext2D,
  S: number,
  tags: NameTag[],
) {
  for (const tag of tags) {
    const text = (tag.text.trim() || "Name").toUpperCase();
    ctx.font = `700 ${S * 0.028}px ${MONO}`;
    const padX = S * 0.02;
    const pillW = ctx.measureText(text).width + padX * 2;
    const pillH = S * 0.048;
    const cx = tag.x * S;
    const cy = tag.y * S;
    const x = cx - pillW / 2;
    const y = cy - pillH / 2;

    ctx.fillStyle = "rgba(6,63,34,.68)";
    rr(ctx, x, y, pillW, pillH, pillH / 2);
    ctx.fill();
    ctx.lineWidth = Math.max(1, S * 0.0025);
    ctx.strokeStyle = "rgba(255,0,128,.9)";
    rr(ctx, x, y, pillW, pillH, pillH / 2);
    ctx.stroke();
    // QR code linking to the project website
    const qrSize = S * 0.085;
    const qrX = S * 0.055;
    const qrY = S * 0.82;

    drawQRCode(ctx, QR_URL, qrX, qrY, qrSize);
    ctx.fillStyle = C.cream;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cx, cy + S * 0.001);
  }
  ctx.textBaseline = "alphabetic";
}
