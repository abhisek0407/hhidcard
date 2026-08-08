/**
 * useExport — export-to-blob, download, and share-to-X logic.
 *
 * Owns no state. Creates `exportBlob` (offscreen canvas at export resolution),
 * `onDownload` (export + saveBlob), and `onShare` (export + shareImage,
 * with desktop fallback via uploadForLink + tweetUrl).
 *
 * Extracted from the monolithic Studio.tsx.
 */

import { useCallback, useState } from "react";
import type { Drawable, Focus } from "@/lib/canvas";
import { drawPFP, PFP_EXPORT } from "@/lib/render/pfp";
import { drawID, ID_EXPORT_W, ID_RATIO } from "@/lib/render/id";
import { drawTeam, TEAM_EXPORT } from "@/lib/render/team";
import { drawTeamGroup, drawNameTags, GROUP_EXPORT } from "@/lib/render/team-group";
import type { NameTag } from "@/lib/render/team-group";
import { BANNER_RATIO, BANNER_W, drawBanner } from "@/lib/render/banner";
import { SIGNATURE } from "@/lib/tokens";
import { saveBlob, shareImage, tweetUrl, uploadForLink } from "@/lib/share";
import { signPng } from "@/lib/png-meta";
import { FILTER_MAP, type FilterPreset } from "../config";

export type Export = {
  onDownload: () => Promise<void>;
  onShare: () => Promise<void>;
  shareUrl: string | null;
};

export function useExport(params: {
  mode: string;
  teamMode: string;
  filterPreset: FilterPreset;
  paint: (
    ctx: CanvasRenderingContext2D,
    size: number,
    image: Drawable | null,
    focus: Focus,
  ) => void;
  camera: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  imageRef: React.MutableRefObject<Drawable | null>;
  focusRef: React.MutableRefObject<Focus>;
  groupTags: NameTag[];
  setManualLink: (v: string | null) => void;
  setBusy: (v: string | null) => void;
  setStatus: (v: string | null) => void;
}): Export {
  const {
    mode, teamMode, paint, camera, videoRef, imageRef, focusRef, groupTags,
    filterPreset,
    setManualLink, setBusy, setStatus,
  } = params;

  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const exportBlob = useCallback(async (): Promise<{ blob: Blob; filename: string }> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");

    let size = PFP_EXPORT;
    let filename = "hhgoa-2026-frame.png";
    if (mode === "id") {
      size = ID_EXPORT_W;
      canvas.width = size;
      canvas.height = Math.round(size * ID_RATIO);
      filename = "hhgoa-2026-builder-id.png";
    } else if (mode === "banner") {
      size = BANNER_W;
      canvas.width = size;
      canvas.height = Math.round(size * BANNER_RATIO);
      filename = "hhgoa-2026-banner.png";
    } else if (mode === "team") {
      size = teamMode === "group" ? GROUP_EXPORT : TEAM_EXPORT;
      canvas.width = canvas.height = size;
      filename = teamMode === "group" ? "hhgoa-2026-team-group.png" : "hhgoa-2026-team.png";
    } else {
      canvas.width = canvas.height = size;
    }

    const source = camera && videoRef.current ? videoRef.current : imageRef.current;
    paint(ctx, size, source, focusRef.current);
    if (mode === "team" && teamMode === "group") {
      drawNameTags(ctx, size, groupTags);
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob) throw new Error("Could not encode the image");
    return { blob: await signPng(blob, SIGNATURE), filename };
  }, [mode, teamMode, groupTags, paint, camera]);

  const onDownload = useCallback(async () => {
    const { blob, filename } = await exportBlob();
    saveBlob(blob, filename);
    setStatus("Saved to your downloads.");
  }, [exportBlob]);

  const onShare = useCallback(async () => {
    setManualLink(null);
    setShareUrl(null);
    setBusy("Preparing\u2026");
    try {
      const { blob, filename } = await exportBlob();
      const result = await shareImage(blob, filename);
      if (result === "shared") {
        setStatus("Shared.");
      } else if (result === "needs-manual") {
        const url = await uploadForLink(blob);
        const rawUrl = url
          ? new URL(
              `/p/${btoa(url).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}`,
              location.origin,
            ).toString()
          : null;
        setShareUrl(rawUrl);
        setManualLink(
          url
            ? tweetUrl(rawUrl!)
            : tweetUrl(),
        );
        setStatus(
          url
            ? "Image saved. Open X \u2014 the link preview will show your graphic."
            : "Image saved. Open X and attach it to the post.",
        );
      }
    } catch {
      setStatus("Could not prepare the image. Try again.");
    } finally {
      setBusy(null);
    }
  }, [exportBlob]); // eslint-disable-line react-hooks/exhaustive-deps

  return { onDownload, onShare, shareUrl };

  return { onDownload, onShare, shareUrl };
}