/**
 * PreviewStage — canvas element, name-tag pill overlays, hint text, and busy overlay.
 *
 * Presentational only: receives already-resolved pointer handlers and state booleans.
 * The branching logic for which handler to attach stays in Studio.tsx.
 */
import type { RefObject } from "react";
import type { NameTag } from "@/lib/render/team-group";

export function PreviewStage(props: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  showGroupTags: boolean;
  groupTags: NameTag[];
  onTagPointerDown: (e: React.PointerEvent<HTMLDivElement>, id: string) => void;
  onTagPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onTagPointerUp: () => void;
  onTagPointerCancel: () => void;
  hint: string | null;
  busy: string | null;
}) {
  return (
    <div
      className="stage relative bg-deep rounded-2xl overflow-hidden touch-none"
      ref={props.stageRef}
      onPointerDown={props.onPointerDown}
      onPointerMove={props.onPointerMove}
      onPointerUp={props.onPointerUp}
      onPointerCancel={props.onPointerCancel}
    >
      <canvas ref={props.canvasRef} />
      {props.showGroupTags &&
        props.groupTags.map((tag) => (
          <div
            key={tag.id}
            className="tag-pill"
            style={{ left: `${tag.x * 100}%`, top: `${tag.y * 100}%` }}
            onPointerDown={(e) => props.onTagPointerDown(e, tag.id)}
            onPointerMove={props.onTagPointerMove}
            onPointerUp={props.onTagPointerUp}
            onPointerCancel={props.onTagPointerCancel}
          >
            {tag.text.trim() || "Name"}
          </div>
        ))}
      {props.hint && <div className="hint">{props.hint}</div>}
      {props.busy && <div className="overlay">{props.busy}</div>}
    </div>
  );
}