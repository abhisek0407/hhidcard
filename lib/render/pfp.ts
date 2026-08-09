import { arcText, drawCover, rr, type Drawable, type Focus } from "../canvas";
import { C, DISPLAY, EVENT_DATES, HASHTAG, MONO, byId } from "../tokens";
import { drawQRCode, QR_URL } from "./qr";
export const PFP_EXPORT = 1024;

/**
 * Square output — but every branded element lives inside the inscribed circle.
 *
 * X displays avatars as circles and throws the corners away. A frame that puts
 * its wordmark in the corners looks finished in the download and empty on the
 * profile. So the event name and dates ride arcs inside the ring, and the
 * corners carry only a secondary mark that shows up when the same file is
 * posted as a square image.
 */
export function drawPFP(
  ctx: CanvasRenderingContext2D,
  S: number,
  image: Drawable | null,
  focus: Focus,
  colorwayId = "tide",
  filter = "",
) {
  const cw = byId(colorwayId);
  const cx = S / 2;
  const cy = S / 2;
  const windowR = S * 0.385;
  const ringMid = S * 0.443;

  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = cw.ring;
  ctx.fillRect(0, 0, S, S);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, windowR, 0, Math.PI * 2);
  ctx.clip();
  if (image) {
    drawCover(
      ctx,
      image,
      cx - windowR,
      cy - windowR,
      windowR * 2,
      windowR * 2,
      focus,
      filter,
    );

    // Subtle Goa-themed teal wash over the photo
    ctx.fillStyle = "rgba(11, 104, 57, 0.18)";
    ctx.fillRect(cx - windowR, cy - windowR, windowR * 2, windowR * 2);
  } else {
    ctx.fillStyle = C.deep;
    ctx.fillRect(cx - windowR, cy - windowR, windowR * 2, windowR * 2);
  }
  ctx.restore();

  // hairlines: one hugging the photo, one at the very edge of the circle crop
  ctx.lineWidth = S * 0.008;
  ctx.strokeStyle = cw.text;
  ctx.beginPath();
  ctx.arc(cx, cy, windowR + ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = S * 0.004;
  ctx.strokeStyle = cw.accent;
  ctx.beginPath();
  ctx.arc(cx, cy, S * 0.4985 - ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = cw.text;
  ctx.font = `700 ${S * 0.052}px ${DISPLAY}`;
  arcText(
    ctx,
    "HACKER HOUSE GOA",
    cx,
    cy,
    ringMid,
    -Math.PI / 2,
    Math.PI * 0.62,
  );

  ctx.fillStyle = cw.accent;
  ctx.font = `700 ${S * 0.036}px ${MONO}`;
  arcText(ctx, EVENT_DATES, cx, cy, ringMid, Math.PI / 2, Math.PI * 0.34, true);

  // lozenges at 3 and 9 o'clock, where the two arcs stop
  ctx.fillStyle = cw.accent;
  for (const angle of [0, Math.PI]) {
    ctx.save();
    ctx.translate(
      cx + Math.cos(angle) * ringMid,
      cy + Math.sin(angle) * ringMid,
    );
    ctx.rotate(angle);
    rr(ctx, -S * 0.012, -S * 0.006, S * 0.024, S * 0.012, S * 0.006);
    ctx.fill();
    ctx.restore();
  }
  // QR code linking to the project website
  const qrSize = S * 0.075;
  const qrX = S * 0.69;
  const qrY = S * 0.78;

  drawQRCode(ctx, QR_URL, qrX, qrY, qrSize);
  // corner marks — visible in the square post, cropped away on the avatar
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = cw.text;
  ctx.font = `700 ${S * 0.021}px ${MONO}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(HASHTAG.toUpperCase(), S * 0.035, S * 0.035);
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText("2:47 PM", S * 0.965, S * 0.965);
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}
