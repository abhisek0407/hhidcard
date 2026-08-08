/**
 * useNameTags — draggable name tag state and handlers for the team-group mode.
 *
 * Owns `draggingTagId`. Tags themselves (NameTag[]) are state owned by
 * Studio.tsx and updated via `setGroupTags`. Tag positions are percentage-
 * based and baked into the canvas only at export (see drawNameTags).
 *
 * Extracted from the monolithic Studio.tsx.
 */

import { useRef } from "react";
import { clamp } from "@/lib/canvas";
import type { NameTag } from "@/lib/render/team-group";

export type NameTags = {
  draggingTagId: React.MutableRefObject<string | null>;
  onTagPointerDown: (e: React.PointerEvent<HTMLDivElement>, id: string) => void;
  onTagPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  endTagDrag: () => void;
  addTag: () => void;
  removeTag: (id: string) => void;
};

export function useNameTags(params: {
  groupStageRef: React.RefObject<HTMLDivElement | null>;
  setGroupTags: (updater: NameTag[] | ((prev: NameTag[]) => NameTag[])) => void;
}): NameTags {
  const { groupStageRef, setGroupTags } = params;

  const draggingTagId = useRef<string | null>(null);

  const onTagPointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    draggingTagId.current = id;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onTagPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const id = draggingTagId.current;
    if (!id) return;
    const rect = groupStageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clamp((e.clientX - rect.left) / rect.width, 0.06, 0.94);
    const y = clamp((e.clientY - rect.top) / rect.height, 0.06, 0.94);
    setGroupTags((prev: NameTag[]) =>
      prev.map((t) => (t.id === id ? { ...t, x, y } : t)),
    );
  };

  const endTagDrag = () => {
    draggingTagId.current = null;
  };

  const addTag = () => {
    const id = Math.random().toString(36).slice(2, 9);
    setGroupTags((prev: NameTag[]) => [...prev, { id, text: "", x: 0.5, y: 0.5 }]);
  };

  const removeTag = (id: string) => {
    setGroupTags((prev: NameTag[]) => prev.filter((t) => t.id !== id));
  };

  return {
    draggingTagId,
    onTagPointerDown,
    onTagPointerMove,
    endTagDrag,
    addTag,
    removeTag,
  };
}