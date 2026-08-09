import {
  drawCover,
  drawGoaBackground,
  fitFont,
  rr,
  type Drawable,
  type Focus,
} from "../canvas";

import { drawQRCode, QR_URL } from "./qr";
import {
  C,
  COHORT,
  DISPLAY,
  EVENT_DATES,
  HASHTAG,
  MONO,
} from "../tokens";

export const ID_EXPORT_W = 1080;
export const ID_RATIO = 1.25; // 4:5 — the tallest frame X shows without cropping

export type IdData = {
  name: string;
  role: string;
  title: string;
  no: string;
};

export function drawID(
  ctx: CanvasRenderingContext2D,
  W: number,
  image: Drawable | null,
  focus: Focus,
  data: IdData,
  filter = "",
) {
  const H = Math.round(W * ID_RATIO);

  ctx.clearRect(0, 0, W, H);

  // Goa-themed background
  drawGoaBackground(ctx, W, H);

  const m = W * 0.062;
  const cardW = W - m * 2;
  const cardH = H - m * 2 - W * 0.085;
  const radius = W * 0.045;

  // Coral offset shadow
  ctx.fillStyle = C.pink;
  rr(
    ctx,
    m + W * 0.018,
    m + W * 0.018,
    cardW,
    cardH,
    radius,
  );
  ctx.fill();

  // Main card
  ctx.fillStyle = C.cream;
  rr(ctx, m, m, cardW, cardH, radius);
  ctx.fill();

  const px = m + W * 0.055;
  const pw = cardW - W * 0.11;
  const cardBottom = m + cardH;

  /*
   * Everything below is measured from the card edges inward rather than
   * stacked downward from the top. This keeps the layout stable even when
   * the name/title changes length.
   */
  const nameSize = W * 0.082;
  const roleSize = W * 0.028;
  const pillH = W * 0.058;

  const footerY = cardBottom - W * 0.048;
  const dividerY = footerY - W * 0.03;
  const pillTop = dividerY - W * 0.032 - pillH;
  const roleBase = pillTop - W * 0.024;
  const nameBase = roleBase - W * 0.036;

  // Residency label
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = C.pink;
  ctx.font = `700 ${W * 0.022}px ${MONO}`;

  ctx.fillText(
    "R E S I D E N C Y   ·   G O A ,   I N D I A",
    px,
    m + W * 0.055,
  );

  // HH GOA 2026
  const markTop = m + W * 0.093;
  const markSize = W * 0.1;

  ctx.fillStyle = C.ink;
  ctx.font = `700 ${markSize}px ${DISPLAY}`;
  ctx.fillText("HH GOA", px, markTop);

  const markW = ctx.measureText("HH GOA ").width;

  ctx.fillStyle = "rgba(16,42,39,.42)";
  ctx.font = `400 ${W * 0.045}px ${DISPLAY}`;
  ctx.fillText(
    "2026",
    px + markW * 1.02,
    markTop + W * 0.05,
  );

  // ---------------------------------------------------------
  // PHOTO
  // ---------------------------------------------------------

  const photoTop = markTop + markSize * 1.16;
  const photoBottom = nameBase - nameSize;

  const photoSize = Math.min(
    pw,
    Math.max(W * 0.2, photoBottom - photoTop),
  );

  const photoX = m + (cardW - photoSize) / 2;
  const inset = W * 0.009;

  ctx.fillStyle = C.green;

  rr(
    ctx,
    photoX,
    photoTop,
    photoSize,
    photoSize,
    W * 0.035,
  );

  ctx.fill();

  ctx.save();

  rr(
    ctx,
    photoX + inset,
    photoTop + inset,
    photoSize - inset * 2,
    photoSize - inset * 2,
    W * 0.028,
  );

  ctx.clip();

  if (image) {
    drawCover(
      ctx,
      image,
      photoX + inset,
      photoTop + inset,
      photoSize - inset * 2,
      photoSize - inset * 2,
      focus,
      filter,
    );

    // Subtle tropical teal wash
    ctx.fillStyle = "rgba(8,127,106,0.10)";
    ctx.fillRect(
      photoX + inset,
      photoTop + inset,
      photoSize - inset * 2,
      photoSize - inset * 2,
    );
  } else {
    ctx.fillStyle = C.deep;

    ctx.fillRect(
      photoX,
      photoTop,
      photoSize,
      photoSize,
    );
  }

  ctx.restore();

  // ---------------------------------------------------------
  // NAME
  // ---------------------------------------------------------

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.ink;

  ctx.font = fitFont(
    ctx,
    data.name,
    pw,
    nameSize,
    700,
    DISPLAY,
  );

  ctx.fillText(
    data.name,
    px,
    nameBase,
  );

  // ---------------------------------------------------------
  // ROLE
  // ---------------------------------------------------------

  const role = data.role.toUpperCase();

  ctx.fillStyle = "rgba(16,42,39,.60)";

  ctx.font = fitFont(
    ctx,
    role,
    pw,
    roleSize,
    400,
    MONO,
  );

  ctx.fillText(
    role,
    px,
    roleBase,
  );

  // ---------------------------------------------------------
  // BUILDER TITLE
  // ---------------------------------------------------------

  const label = data.title.toUpperCase();

  ctx.font = `700 ${W * 0.026}px ${MONO}`;

  const pillW = Math.min(
    pw,
    ctx.measureText(label).width + W * 0.05,
  );

  ctx.fillStyle = C.pink;

  rr(
    ctx,
    px,
    pillTop,
    pillW,
    pillH,
    pillH / 2,
  );

  ctx.fill();

  ctx.fillStyle = "#FFFFFF";

  ctx.textBaseline = "middle";

  ctx.fillText(
    label,
    px + W * 0.025,
    pillTop + pillH / 2 + W * 0.002,
  );

  // ---------------------------------------------------------
  // DIVIDER
  // ---------------------------------------------------------

  ctx.strokeStyle = "rgba(16,42,39,.16)";
  ctx.lineWidth = Math.max(1, W * 0.002);

  ctx.beginPath();

  ctx.moveTo(
    px,
    dividerY,
  );

  ctx.lineTo(
    px + pw,
    dividerY,
  );

  ctx.stroke();

  // ---------------------------------------------------------
  // FOOTER
  // ---------------------------------------------------------

  ctx.font = `700 ${W * 0.024}px ${MONO}`;

  ctx.fillStyle = "rgba(16,42,39,.50)";

  ctx.textAlign = "left";

  ctx.fillText(
    `RESIDENT ${data.no} / ${COHORT}`,
    px,
    footerY,
  );

  ctx.textAlign = "right";

  ctx.fillStyle = C.green;

  ctx.fillText(
    EVENT_DATES,
    px + pw,
    footerY,
  );

  // ---------------------------------------------------------
  // QR CODE
  // ---------------------------------------------------------
  //
  // The QR points to QR_URL, currently:
  // http://localhost:3000
  //
  // It is drawn directly onto the export canvas, so it becomes
  // part of the downloaded PNG.
  //

  const qrSize = W * 0.095;

  const qrX =
    px + pw - qrSize;

  const qrY =
    dividerY - qrSize - W * 0.02;

  drawQRCode(
    ctx,
    QR_URL,
    qrX,
    qrY,
    qrSize,
  );

  // Small QR caption
  ctx.textAlign = "right";
  ctx.textBaseline = "top";

  ctx.fillStyle = "rgba(16,42,39,.55)";
  ctx.font = `700 ${W * 0.014}px ${MONO}`;

  ctx.fillText(
    "SCAN TO VISIT",
    qrX + qrSize,
    qrY + qrSize + W * 0.008,
  );

  // ---------------------------------------------------------
  // HASHTAG
  // ---------------------------------------------------------

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = C.cream;

  ctx.font = `700 ${W * 0.03}px ${MONO}`;

  ctx.fillText(
    HASHTAG,
    W / 2,
    H - W * 0.045,
  );

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}