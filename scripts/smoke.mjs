/**
 * Renders every format headlessly so the output can be eyeballed without a
 * browser. Run: node scripts/smoke.mjs  → writes to ./smoke/
 */
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { mkdirSync, writeFileSync } from "node:fs";


const { drawPFP, PFP_EXPORT } = await import("../lib/render/pfp.ts");
const { drawID, ID_EXPORT_W, ID_RATIO } = await import("../lib/render/id.ts");
const { drawTeam, TEAM_EXPORT } = await import("../lib/render/team.ts");
const { drawTeamGroup, drawNameTags, GROUP_EXPORT } = await import("../lib/render/team-group.ts");
const { drawBanner, BANNER_W, BANNER_RATIO } = await import("../lib/render/banner.ts");

mkdirSync("smoke", { recursive: true });

// stand-in photo: a wide landscape shot, to prove cover-fit handles it
function fakePhoto(w, h) {
  const c = createCanvas(w, h);
  const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#2b6cb0");
  g.addColorStop(1, "#d69e2e");
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);
  x.fillStyle = "rgba(0,0,0,.35)";
  for (let i = 0; i < 40; i++) {
    x.fillRect(Math.random() * w, Math.random() * h, 40, 40);
  }
  x.fillStyle = "#fff";
  x.font = `bold ${h * 0.2}px sans-serif`;
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText("PHOTO", w / 2, h / 2);
  return c;
}

const wide = fakePhoto(2000, 1125); // 16:9 landscape — the awkward case
const focus = { x: 0.5, y: 0.45, z: 1 };

function out(name, w, h, fn) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  // the browser has document.createElement for grid tiles; stub it here
  globalThis.document = { createElement: () => createCanvas(2, 2) };
  const t0 = performance.now();
  fn(ctx);
  const ms = (performance.now() - t0).toFixed(1);
  writeFileSync(`smoke/${name}.png`, canvas.toBuffer("image/png"));
  console.log(`${name.padEnd(14)} ${w}x${h}  ${ms}ms`);
}

out("pfp", PFP_EXPORT, PFP_EXPORT, (ctx) => drawPFP(ctx, PFP_EXPORT, wide, focus, "genesis"));
out("pfp-launch", PFP_EXPORT, PFP_EXPORT, (ctx) => drawPFP(ctx, PFP_EXPORT, wide, focus, "launch"));
out("id", ID_EXPORT_W, Math.round(ID_EXPORT_W * ID_RATIO), (ctx) =>
  drawID(ctx, ID_EXPORT_W, wide, focus, {
    name: "Abhisek",
    role: "Full-stack · Web3",
    title: "Midnight Shipper",
    no: "042",
  }),
);
out("banner", BANNER_W, Math.round(BANNER_W * BANNER_RATIO), (ctx) =>
  drawBanner(ctx, BANNER_W, wide, focus),
);
out("team", TEAM_EXPORT, TEAM_EXPORT, (ctx) =>
  drawTeam(ctx, TEAM_EXPORT, [{ img: wide }, { img: wide }, { img: wide }, { img: wide }], [
    "Abhisek",
    "Pabitra",
    "Dibyajyoti",

  ]),
);
out("team-2", TEAM_EXPORT, TEAM_EXPORT, (ctx) =>
  drawTeam(ctx, TEAM_EXPORT, [{ img: wide }, { img: wide }], ["Abhisek", "Pabitra"]),
);
out("group", GROUP_EXPORT, GROUP_EXPORT, (ctx) => {
  drawTeamGroup(ctx, GROUP_EXPORT, wide, focus);
  drawNameTags(ctx, GROUP_EXPORT, [
    { id: "1", text: "Abhisek", x: 0.28, y: 0.32 },
    { id: "2", text: "Pabitra", x: 0.72, y: 0.32 },
    { id: "3", text: "A Really Long Teammate Name", x: 0.5, y: 0.72 },
  ]);
});
out("group-notags", GROUP_EXPORT, GROUP_EXPORT, (ctx) => drawTeamGroup(ctx, GROUP_EXPORT, wide, focus));

console.log("\nWrote smoke/*.png");
