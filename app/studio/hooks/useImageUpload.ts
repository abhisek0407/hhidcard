/**
 * useImageUpload — file upload handling for the Studio.
 *
 * Owns no state. Routes uploaded files to the correct ref (solo, group, or team)
 * based on the `slot` parameter. Calls `scheduleRender` after a successful load.
 *
 * Extracted from the monolithic Studio.tsx.
 */

import { useCallback } from "react";
import { DEFAULT_FOCUS, type Drawable, type Focus } from "@/lib/canvas";
import { ImageLoadError, fileToDrawable, release } from "@/lib/image";
import { MAX_TEAM } from "../config";
import type { Member } from "@/lib/render/team";

export type Slot = "solo" | "team" | "group";

export type ImageUpload = {
  accept: (file: File, slot: Slot) => Promise<void>;
};

export function useImageUpload(params: {
  imageRef: React.MutableRefObject<Drawable | null>;
  focusRef: React.MutableRefObject<Focus>;
  groupImageRef: React.MutableRefObject<Drawable | null>;
  groupFocusRef: React.MutableRefObject<Focus>;
  teamRef: React.MutableRefObject<Member[]>;
  scheduleRender: () => void;
  setHasImage: (v: boolean) => void;
  setGroupHasImage: (v: boolean) => void;
  setZoom: (v: number) => void;
  setGroupZoom: (v: number) => void;
  setTeamCount: (v: number) => void;
  setBusy: (v: string | null) => void;
  setStatus: (v: string | null) => void;
}): ImageUpload {
  const {
    imageRef,
    focusRef,
    groupImageRef,
    groupFocusRef,
    teamRef,
    scheduleRender,
    setHasImage,
    setGroupHasImage,
    setZoom,
    setGroupZoom,
    setTeamCount,
    setBusy,
    setStatus,
  } = params;

  /* ---------- loading photos ---------- */

  const accept = useCallback(
    async (file: File, slot: "solo" | "team" | "group") => {
      setBusy(/heic|heif/i.test(file.name) ? "Converting HEIC…" : "Reading photo…");
      setStatus(null);
      try {
        const drawable = await fileToDrawable(file);
        if (slot === "solo") {
          release(imageRef.current);
          imageRef.current = drawable;
          focusRef.current = { ...DEFAULT_FOCUS };
          setZoom(1);
          setHasImage(true);
        } else if (slot === "group") {
          release(groupImageRef.current);
          groupImageRef.current = drawable;
          groupFocusRef.current = { ...DEFAULT_FOCUS };
          setGroupZoom(1);
          setGroupHasImage(true);
        } else {
          if (teamRef.current.length >= MAX_TEAM) {
            release(drawable);
          } else {
            teamRef.current = [...teamRef.current, { img: drawable }];
            setTeamCount(teamRef.current.length);
          }
        }
        scheduleRender();
      } catch (err) {
        setStatus(
          err instanceof ImageLoadError
            ? `${err.message}. Try a JPG or PNG instead.`
            : "That file would not open. Try a JPG or PNG instead.",
        );
      } finally {
        setBusy(null);
      }
    },
    [scheduleRender], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return { accept };
}