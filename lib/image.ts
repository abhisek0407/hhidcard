import type { Drawable } from "./canvas";

/**
 * Nothing we render exceeds 1500px on its longest edge, so anything past
 * this is pure memory cost. A modern iPhone shoots 48MP — decoded, that is
 * roughly 200MB of bitmap, which is where mid-range Android runs out of
 * memory and the tab dies. Cap it before it ever reaches a render.
 */
const MAX_EDGE = 2400;

export class ImageLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageLoadError";
  }
}

const isHeic = (file: File) =>
  /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);

/** heic2any is ~1MB, so it only loads when someone actually picks a HEIC. */
async function decodeHeic(file: File): Promise<Blob> {
  const { default: heic2any } = await import("heic2any");
  const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
  return Array.isArray(out) ? out[0] : (out as Blob);
}

function shrink(source: Drawable, w: number, h: number): HTMLCanvasElement {
  const scale = MAX_EDGE / Math.max(w, h);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  }
  return canvas;
}

function fromObjectUrl(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageLoadError("Browser could not decode this image"));
    };
    img.src = url;
  });
}

/**
 * File in, ready-to-draw bitmap out.
 * `imageOrientation: "from-image"` is the piece that stops iPhone portraits
 * arriving sideways — the EXIF rotation tag is applied at decode time.
 */
export async function fileToDrawable(file: File): Promise<Drawable> {
  let blob: Blob = file;

  if (isHeic(file)) {
    try {
      blob = await decodeHeic(file);
    } catch {
      throw new ImageLoadError("This HEIC could not be converted");
    }
  }

  let source: Drawable | null = null;

  if (typeof createImageBitmap === "function") {
    try {
      source = await createImageBitmap(blob, { imageOrientation: "from-image" });
    } catch {
      source = null;
    }
  }
  if (!source) source = await fromObjectUrl(blob);

  const w = source.width;
  const h = source.height;
  if (Math.max(w, h) > MAX_EDGE) {
    const small = shrink(source, w, h);
    release(source);
    return small;
  }
  return source;
}

/** ImageBitmaps hold GPU memory until closed. Call this when swapping photos. */
export function release(image: Drawable | null | undefined) {
  if (image && typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) {
    image.close();
  }
}
