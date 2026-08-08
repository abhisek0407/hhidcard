/**
 * NameTagEditor — input rows for group name tags + add button.
 */
import type { NameTag } from "@/lib/render/team-group";

const inputCls =
  "w-full font-display text-base text-ink bg-white border border-green/28 rounded-xl px-[13px] py-3 focus:outline-none focus:border-pink focus:shadow-[0_0_0_3px_rgba(255,0,128,0.16)]";

export function NameTagEditor(props: {
  groupTags: NameTag[];
  maxTags: number;
  onTagChange: (id: string, text: string) => void;
  onRemoveTag: (id: string) => void;
  onAddTag: () => void;
}) {
  return (
    <div className="grid gap-3 mt-4">
      {props.groupTags.map((tag, i) => (
        <div key={tag.id}>
          <label htmlFor={`tag-${tag.id}`} className="block font-mono text-[10px] font-bold tracking-[0.12em] uppercase text-ink/55 mb-[6px]">
            Name tag {i + 1}
          </label>
          <div className="flex gap-2 items-center">
            <input
              id={`tag-${tag.id}`}
              maxLength={20}
              placeholder="Krishna"
              value={tag.text}
              onChange={(e) => props.onTagChange(tag.id, e.target.value)}
              className={"flex-1 " + inputCls}
            />
            <button
              className="flex-none appearance-none w-10 h-10 rounded-xl border border-green/25 bg-transparent text-ink/50 text-base cursor-pointer hover:bg-pink/8 hover:border-pink hover:text-pink"
              onClick={() => props.onRemoveTag(tag.id)}
              aria-label={`Remove name tag ${i + 1}`}
              type="button"
            >
              \u00d7
            </button>
          </div>
        </div>
      ))}
      {props.groupTags.length < props.maxTags && (
        <button
          className="appearance-none border-0 bg-pink/12 text-pink font-mono text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-[9px] rounded-lg cursor-pointer justify-self-start hover:bg-pink/20"
          onClick={props.onAddTag}
          type="button"
        >
          + Add name tag
        </button>
      )}
    </div>
  );
}