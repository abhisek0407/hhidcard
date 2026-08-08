import { createCanvas, Image } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";

globalThis.document = { createElement: () => createCanvas(2, 2) };
globalThis.Blob = class {
  constructor(parts, opts) {
    this._buf = Buffer.concat(parts.map(p => Buffer.isBuffer(p) ? p : Buffer.from(p)));
    this.type = opts?.type;
  }
  async arrayBuffer() { return this._buf.buffer.slice(this._buf.byteOffset, this._buf.byteOffset + this._buf.byteLength); }
};

const { signPng } = await import("../lib/watermark.ts");
const { SIGNATURE } = await import("../lib/tokens.ts");

const c = createCanvas(200, 200);
const ctx = c.getContext("2d");
ctx.fillStyle = "#0B6839"; ctx.fillRect(0, 0, 200, 200);
const rawBuf = c.toBuffer("image/png");

const signed = await signPng(new globalThis.Blob([rawBuf], { type: "image/png" }), SIGNATURE);
const signedBuf = Buffer.from(await signed.arrayBuffer());
writeFileSync("/tmp/signed.png", signedBuf);

console.log("before:", rawBuf.length, "bytes  after:", signedBuf.length, "bytes\n");

// real PNG chunk walker — proves structural validity, not just byte search
function walkChunks(buf) {
  const out = [];
  let off = 8;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    out.push({ type, data });
    off += 12 + len;
  }
  return out;
}

const chunks = walkChunks(signedBuf);
console.log("chunk order:", chunks.map(c => c.type).join(" \u2192 "));
console.log();

let ok = true;
for (const { type, data } of chunks) {
  if (type !== "tEXt") continue;
  const nul = data.indexOf(0);
  const keyword = data.toString("ascii", 0, nul);
  const text = data.toString("utf8", nul + 1);
  const expected = SIGNATURE[keyword];
  const match = expected === text;
  ok &&= match;
  console.log(`tEXt  ${keyword.padEnd(10)} = "${text}"`);
  console.log(`      exact match to SIGNATURE.${keyword}: ${match}`);
}

console.log();
console.log("all 4 signature fields present as exact tEXt chunks:", ok && chunks.filter(c => c.type === "tEXt").length === 4);

// prove it still decodes as a normal image — the watermark can't break the export
const img = new Image();
await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = signedBuf; });
console.log("re-decodes as a valid image:", img.width === 200 && img.height === 200);
