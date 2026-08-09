/**
 * usePreviewRender — owns the preview canvas render loop.
 *
 * Creates `paint` (dispatches to the right lib/render/* drawer), `renderNow`
 * (sizes the canvas and calls paint once), and `scheduleRender` (rAF-throttled
 * redraw). Also owns `rafRef`, `cameraRef`, and `canvasRef`.
 *
 * All other hooks receive `scheduleRender` from here — there is only ONE
 * render loop, and this is it.
 *
 * Extracted from the monolithic Studio.tsx.
 */

import { useCallback, useEffect, useRef } from "react";
import { type Drawable, type Focus } from "@/lib/canvas";
import { release } from "@/lib/image";
import { drawPFP } from "@/lib/render/pfp";
import { drawID, ID_RATIO, type IdData } from "@/lib/render/id";
import { drawTeam, type Member } from "@/lib/render/team";
import { drawTeamGroup } from "@/lib/render/team-group";
import { BANNER_RATIO, drawBanner } from "@/lib/render/banner";
import { builderTitle, residentNo } from "@/lib/titles";
import { PREVIEW, FILTER_MAP, type FilterPreset } from "../config";
import { drawQRCode, QR_URL } from "@/lib/render/qr";
export type PreviewRender = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  rafRef: React.MutableRefObject<number | null>;
  cameraRef: React.MutableRefObject<boolean>;
  paint: (
    ctx: CanvasRenderingContext2D,
    size: number,
    image: Drawable | null,
    focus: Focus,
  ) => void;
  renderNow: () => void;
  scheduleRender: () => void;
};

export function usePreviewRender(params: {
  mode: string;
  teamMode: string;
  colorway: string;
  name: string;
  role: string;
  title: string;
  teamNames: string;
  filterPreset: FilterPreset;
  groupImageRef: React.MutableRefObject<Drawable | null>;
  groupFocusRef: React.MutableRefObject<Focus>;
  teamRef: React.MutableRefObject<Member[]>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  imageRef: React.MutableRefObject<Drawable | null>;
  focusRef: React.MutableRefObject<Focus>;
  setRenderMs: (ms: number | null) => void;
  loopRef: React.MutableRefObject<number | null>;
  streamRef: React.MutableRefObject<MediaStream | null>;
}): PreviewRender {
  const {
    mode, teamMode, colorway, name, role, title, teamNames,
    filterPreset,
    groupImageRef, groupFocusRef, teamRef,
    videoRef, imageRef, focusRef, setRenderMs,
    loopRef, streamRef,
  } = params;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const cameraRef = useRef(false);

  /* ---------- paint ---------- */

  const filter = FILTER_MAP[filterPreset] ?? "";
  const paint = useCallback(
    (ctx: CanvasRenderingContext2D, size: number, image: Drawable | null, focus: Focus) => {
      const data: IdData = {
        name: name.trim() || "Your name",
        role: role.trim() || "Builder",
        title: title.trim() || builderTitle(name + role),
        no: residentNo(name + role),
      };
      if (mode === "pfp") drawPFP(ctx, size, image, focus, colorway, filter);
      else if (mode === "id") drawID(ctx, size, image, focus, data, filter);
      else if (mode === "banner") drawBanner(ctx, size, image, focus, filter);
      else if (mode === "team" && teamMode === "group") {
        drawTeamGroup(ctx, size, groupImageRef.current, groupFocusRef.current, filter);
      } else drawTeam(ctx, size, teamRef.current, teamNames.split(","));
    },
    [mode, teamMode, colorway, name, role, title, teamNames, filter],
  );

  /* ---------- renderNow ---------- */

  const renderNow = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = PREVIEW;
    const h =
      mode === "id"
        ? Math.round(PREVIEW * ID_RATIO)
        : mode === "banner"
          ? Math.round(PREVIEW * BANNER_RATIO)
          : PREVIEW;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const started = performance.now();
    const source = cameraRef.current && videoRef.current ? videoRef.current : imageRef.current;
    paint(ctx, w, source, focusRef.current);
    setRenderMs(Math.round((performance.now() - started) * 10) / 10);
  }, [mode, paint]);

  /* ---------- scheduleRender ---------- */

  const scheduleRender = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      renderNow();
    });
  }, [renderNow]);

  /* ---------- effects ---------- */

  useEffect(() => { scheduleRender(); }, [scheduleRender]);
  useEffect(() => {
    console.log(
      "%cFrame In Goa %c\u2014 built by Krishna (KrishnaaCodeWala) for HH Goa 2026.\nKRISHNA IS THE BEST.\ngithub.com/KrishnaaCodeWala/framein-goa",
      "color:#FF0080;font-weight:700;font-size:15px",
      "color:#0B6839;font-weight:400;font-size:11px",
    );
  }, []);
  useEffect(() => {
    if (!document.fonts) return;
    Promise.all([
      document.fonts.load('700 100px "Space Grotesk"'),
      document.fonts.load('400 100px "Space Grotesk"'),
      document.fonts.load('700 100px "JetBrains Mono"'),
      document.fonts.load('400 100px "JetBrains Mono"'),
    ]).catch(() => undefined).then(() => scheduleRender());
  }, [scheduleRender]);
  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (loopRef.current !== null) cancelAnimationFrame(loopRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      release(imageRef.current);
      teamRef.current.forEach((m) => release(m.img));
    },
    [],
  );

  return { canvasRef, rafRef, cameraRef, paint, renderNow, scheduleRender };
}