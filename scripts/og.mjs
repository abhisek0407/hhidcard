/** Builds public/og-default.png — the link preview for the tool itself. */
import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";

globalThis.document = { createElement: () => createCanvas(2, 2) };
const { drawPFP } = await import("../lib/render/pfp.ts");

const W = 1200, H = 630;
const c = createCanvas(W, H);
const x = c.getContext("2d");

x.fillStyle = "#0B6839";
x.fillRect(0, 0, W, H);
x.strokeStyle = "rgba(255,251,232,.07)";
x.lineWidth = 1;
for (let i = 60; i < W; i += 60) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); }
for (let i = 60; i < H; i += 60) { x.beginPath(); x.moveTo(0, i); x.lineTo(W, i); x.stroke(); }

// a real frame, rendered by the real renderer, sitting on the right
const ring = createCanvas(400, 400);
drawPFP(ring.getContext("2d"), 400, null, { x: .5, y: .45, z: 1 }, "genesis");
x.drawImage(ring, W - 460, (H - 400) / 2);

x.fillStyle = "#FF0080";
x.font = "700 26px sans-serif";
x.fillText("F R A M E   I N   G O A", 80, 190);
x.fillStyle = "#FFFBE8";
x.font = "700 78px sans-serif";
x.fillText("Get your HH Goa", 80, 290);
x.fillText("2026 frame", 80, 375);
x.fillStyle = "rgba(255,251,232,.6)";
x.font = "400 26px sans-serif";
x.fillText("Photo in, branded graphic out. 28-31 Oct - Goa.", 80, 435);
x.fillStyle = "#FF0080";
x.fillRect(80, 120, 6, 340);

writeFileSync("public/og-default.png", c.toBuffer("image/png"));
console.log("wrote public/og-default.png", W + "x" + H);
