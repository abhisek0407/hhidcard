/**
 * useImageDrag — solo and group photo drag-to-reposition handlers.
 *
 * Owns the drag-in-progress refs (`dragging`, `last`, `groupDragging`,
 * `groupLast`). Reads shared refs passed in from Studio.tsx. Calls
 * `scheduleRender` on each pointer move so the preview updates.
 *
 * Extracted from the monolithic Studio.tsx.
 */

import { useRef } from "react";
import { clamp, type Focus } from "@/lib/canvas";

export type ImageDrag = {
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  endDrag: () => void;
  onGroupPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onGroupPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  endGroupDrag: () => void;
};

export function useImageDrag(params: {
  focusRef: React.MutableRefObject<Focus>;
  groupFocusRef: React.MutableRefObject<Focus>;
  scheduleRender: () => void;
  hasImage: boolean;
  groupHasImage: boolean;
  mode: string;
  draggingTagId: React.MutableRefObject<string | null>;
}): ImageDrag {
  const {
    focusRef,
    groupFocusRef,
    scheduleRender,
    hasImage,
    groupHasImage,
    mode,
    draggingTagId,
  } = params;

  /* ---------- solo photo drag ---------- */

  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasImage || mode === "team") return;
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const f = focusRef.current;
    f.x = clamp(f.x - (e.clientX - last.current.x) / rect.width, 0, 1);
    f.y = clamp(f.y - (e.clientY - last.current.y) / rect.height, 0, 1);
    last.current = { x: e.clientX, y: e.clientY };
    scheduleRender();
  };

  const endDrag = () => {
    dragging.current = false;
  };

  /* ---------- group photo drag ---------- */

  const groupDragging = useRef(false);
  const groupLast = useRef({ x: 0, y: 0 });

  const onGroupPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!groupHasImage || draggingTagId.current) return;
    groupDragging.current = true;
    groupLast.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onGroupPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!groupDragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const f = groupFocusRef.current;
    f.x = clamp(f.x - (e.clientX - groupLast.current.x) / rect.width, 0, 1);
    f.y = clamp(f.y - (e.clientY - groupLast.current.y) / rect.height, 0, 1);
    groupLast.current = { x: e.clientX, y: e.clientY };
    scheduleRender();
  };

  const endGroupDrag = () => {
    groupDragging.current = false;
  };

  return {
    onPointerDown,
    onPointerMove,
    endDrag,
    onGroupPointerDown,
    onGroupPointerMove,
    endGroupDrag,
  };
}