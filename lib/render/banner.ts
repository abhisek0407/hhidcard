import { drawCover, gridPattern, rr, type Drawable, type Focus } from "../canvas";
import { C, DISPLAY, EVENT_DATES, HASHTAG, MONO } from "../tokens";

export const BANNER_W = 1500;
export const BANNER_H = 500;
export const BANNER_RATIO = BANNER_H / BANNER_W;

/**
 * X header. Two constraints shape this layout:
 *  - the avatar sits over the lower left, so nothing important goes there
 *  - narrow viewports crop the left and right edges
 * Hence the photo on the right and the wordmark held off the bottom-left corner.
 */
export function drawBanner(
  ctx: CanvasRenderingContext2D,
  W: number,
  image: Drawable | null,
  focus: Focus,
  filter = "",
) {
  const H = Math.round(W * BANNER_RATIO);
  const u = W / BANNER_W; // scale unit, so all numbers read at 1500px

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = C.green;
  ctx.fillRect(0, 0, W, H);

  const grid = gridPattern(ctx, 60 * u, "rgba(255,251,232,.09)");
  if (grid) {
    ctx.fillStyle = grid;
    ctx.fillRect(0, 0, W, H);
  }

  // photo panel, right hand third
  const panelW = 500 * u;
  const panelX = W - panelW - 60 * u;
  const panelY = 46 * u;
  const panelH = H - 92 * u;

  ctx.save();
  rr(ctx, panelX, panelY, panelW, panelH, 28 * u);
  ctx.clip();
  if (image) {
    drawCover(ctx, image, panelX, panelY, panelW, panelH, focus, filter);
    // green wash so the wordmark stays legible against any photo
    ctx.fillStyle = "rgba(11,104,57,.28)";
    ctx.fillRect(panelX, panelY, panelW, panelH);
  } else {
    ctx.fillStyle = C.deep;
    ctx.fillRect(panelX, panelY, panelW, panelH);
  }
  ctx.restore();

  ctx.lineWidth = 6 * u;
  ctx.strokeStyle = C.pink;
  rr(ctx, panelX, panelY, panelW, panelH, 28 * u);
  ctx.stroke();

  // type block, clear of the avatar's footprint
  const tx = 96 * u;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = C.pink;
  ctx.font = `700 ${26 * u}px ${MONO}`;
  ctx.fillText("G O A ,   I N D I A", tx, 150 * u);

  ctx.fillStyle = C.cream;
  ctx.font = `700 ${94 * u}px ${DISPLAY}`;
  ctx.fillText("HACKER HOUSE", tx, 245 * u);
  ctx.fillText("GOA 2026", tx, 340 * u);

  ctx.fillStyle = "rgba(255,251,232,.62)";
  ctx.font = `400 ${28 * u}px ${MONO}`;
  ctx.fillText(`${EVENT_DATES}  \u00b7  ${HASHTAG.toUpperCase()}`, tx, 410 * u);

  // pink rule down the left edge
  ctx.fillStyle = C.pink;
  ctx.fillRect(60 * u, 120 * u, 8 * u, 300 * u);
}
