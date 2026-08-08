/**
 * Embeds authorship metadata directly into a PNG's bytes as a standard
 * tEXt chunk (the same mechanism `exiftool` or `identify -verbose` reads).
 * Invisible in the rendered image, present in every file this tool exports.
 *
 * This is not encryption or obfuscation — anyone reading the source can see
 * exactly what it does. The point isn't to be unbreakable, it's that a fork
 * has to *notice and remove* this specific step to strip provenance, rather
 * than provenance disappearing for free the moment someone copies the repo.
 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function textChunk(keyword: string, text: string): Uint8Array {
  const enc = new TextEncoder();
  const kw = enc.encode(keyword);
  const tx = enc.encode(text);
  const type = enc.encode("tEXt");

  const data = new Uint8Array(kw.length + 1 + tx.length);
  data.set(kw, 0);
  data[kw.length] = 0;
  data.set(tx, kw.length + 1);

  const crcInput = new Uint8Array(type.length + data.length);
  crcInput.set(type, 0);
  crcInput.set(data, type.length);
  const crc = crc32(crcInput);

  const chunk = new Uint8Array(4 + 4 + data.length + 4);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, data.length, false);
  chunk.set(type, 4);
  chunk.set(data, 8);
  view.setUint32(8 + data.length, crc, false);
  return chunk;
}

/**
 * Returns a new PNG blob with the given key/value pairs written as tEXt
 * chunks immediately after IHDR (the position the spec requires ancillary
 * chunks to be valid in). Falls back to the original blob untouched if the
 * input isn't a well-formed PNG, so a malformed export never breaks download
 * or share over a cosmetic feature.
 */
export async function signPng(blob: Blob, meta: Record<string, string>): Promise<Blob> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  const isPng =
    buf.length > 33 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  if (!isPng) return blob;

  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const ihdrLen = view.getUint32(8, false);
  const ihdrType = String.fromCharCode(buf[12], buf[13], buf[14], buf[15]);
  if (ihdrType !== "IHDR") return blob;

  const ihdrEnd = 8 + 4 + 4 + ihdrLen + 4;
  const chunks = Object.entries(meta).map(([k, v]) => textChunk(k, v));
  const extra = chunks.reduce((n, c) => n + c.length, 0);

  const out = new Uint8Array(buf.length + extra);
  out.set(buf.subarray(0, ihdrEnd), 0);
  let pos = ihdrEnd;
  for (const c of chunks) {
    out.set(c, pos);
    pos += c.length;
  }
  out.set(buf.subarray(ihdrEnd), pos);

  return new Blob([out], { type: "image/png" });
}
