/** Anything we can hand to ctx.drawImage that also reports its own size. */
export type Drawable =
  | ImageBitmap
  | HTMLImageElement
  | HTMLCanvasElement
  | HTMLVideoElement;

/** Where the subject sits inside the frame, plus zoom and rotation. */
export type Focus = { x: number; y: number; z: number; r: number };

export const DEFAULT_FOCUS: Focus = { x: 0.5, y: 0.45, z: 1, r: 0 };

export const clamp = (v: number, a: number, b: number) =>
  Math.min(b, Math.max(a, v));

/**
 * A <video> reports its frame size as videoWidth/videoHeight, not width/height.
 * Duck-typed rather than `instanceof HTMLVideoElement` so this stays safe
 * wherever the DOM constructors are absent — server render, worker, test.
 */
function sizeOf(image: Drawable): { w: number; h: number } {
  const v = image as Partial<HTMLVideoElement>;
  if (typeof v.videoWidth === "number" && v.videoWidth > 0) {
    return { w: v.videoWidth, h: v.videoHeight as number };
  }
  return { w: (image as HTMLCanvasElement).width, h: (image as HTMLCanvasElement).height };
}

/** Rounded rectangle. arcTo rather than roundRect — older Safari lacks the latter. */
export function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

/** Shrink the font until the text fits the given width. Returns the font string. */
export function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  start: number,
  weight: number,
  family: string,
): string {
  let size = start;
  const floor = start * 0.35;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    size -= start * 0.03;
  } while (ctx.measureText(text).width > maxW && size > floor);
  return ctx.font;
}

/** Lay text out along a circular arc, one glyph at a time. */
/**
 * Lay text out along a circular arc, one glyph at a time.
 *
 * `bottom` selects which half of the circle the text sits on, and it changes
 * two things at once: glyphs rotate the other way so they stay upright, and
 * the run travels anticlockwise so it still reads left to right. Getting only
 * one of the two right yields mirrored or upside-down text.
 */
export function arcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  centerAngle: number,
  spread: number,
  bottom = false,
) {
  const chars = [...text];
  const step = spread / Math.max(chars.length - 1, 1);
  const dir = bottom ? -1 : 1;
  const tilt = bottom ? -Math.PI / 2 : Math.PI / 2;
  let a = centerAngle - (dir * spread) / 2;

  const prevAlign = ctx.textAlign;
  const prevBaseline = ctx.textBaseline;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const ch of chars) {
    ctx.save();
    ctx.translate(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    ctx.rotate(a + tilt);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    a += dir * step;
  }

  ctx.textAlign = prevAlign;
  ctx.textBaseline = prevBaseline;
}

/**
 * Cover-fit an image into a box, honouring a focal point, zoom, and rotation.
 * Rotation is 90-degree increments stored in focus.r (0–3).
 * When r is odd (90° or 270°) the source dimensions are swapped so the
 * cover-fit calculation still fills the destination rectangle correctly.
 *
 * Rotation happens around the center of the destination box, so dragging
 * and zooming remain intuitive regardless of orientation.
 */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  image: Drawable,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  focus: Focus,
  filter = "",
) {
  const { w: iw, h: ih } = sizeOf(image);
  if (!iw || !ih) return;

  // For 90°/270° swap src dimensions so cover-fit fills correctly
  const sw = focus.r % 2 === 1 ? ih : iw;
  const sh = focus.r % 2 === 1 ? iw : ih;
  const scale = Math.max(dw / sw, dh / sh) * focus.z;

  const w = iw * scale;
  const h = ih * scale;

  const maxX = Math.max(0, (w - dw) / 2);
  const maxY = Math.max(0, (h - dh) / 2);
  const ox = clamp((focus.x - 0.5) * 2, -1, 1) * maxX;
  const oy = clamp((focus.y - 0.5) * 2, -1, 1) * maxY;

  const drawX = dx + (dw - w) / 2 - ox;
  const drawY = dy + (dh - h) / 2 - oy;

  ctx.save();
  ctx.beginPath();
  ctx.rect(dx, dy, dw, dh);
  ctx.clip();

  if (focus.r !== 0) {
    ctx.translate(dx + dw / 2, dy + dh / 2);
    ctx.rotate(focus.r * (Math.PI / 2));
    ctx.translate(-dx - dw / 2, -dy - dh / 2);
  }

  // ctx.filter is scoped by ctx.save() above — restore() below
  // resets it, so frame text/borders drawn after this call are never
  // affected by the photo filter.  The empty-string default means
  // renderers that don't accept a filter (e.g. team.ts per-slot) pass
  // nothing and get a no-op.
  if (filter) ctx.filter = filter;
  ctx.drawImage(image, drawX, drawY, w, h);
  ctx.restore();
}

/**
 * The faint measuring grid from hhgoa.com.
 * Baked into a cached tile so a drag doesn't restroke ~100 lines per frame.
 */
const tiles = new Map<string, HTMLCanvasElement>();

export function gridPattern(
  ctx: CanvasRenderingContext2D,
  cell: number,
  stroke: string,
): CanvasPattern | null {
  const px = Math.max(2, Math.round(cell));
  const key = `${px}|${stroke}`;
  let tile = tiles.get(key);
  if (!tile) {
    tile = document.createElement("canvas");
    tile.width = tile.height = px;
    const t = tile.getContext("2d");
    if (!t) return null;
    t.strokeStyle = stroke;
    t.lineWidth = Math.max(1, px * 0.025);
    t.beginPath();
    t.moveTo(0.5, 0);
    t.lineTo(0.5, px);
    t.moveTo(0, 0.5);
    t.lineTo(px, 0.5);
    t.stroke();
    tiles.set(key, tile);
  }
  return ctx.createPattern(tile, "repeat");
}
