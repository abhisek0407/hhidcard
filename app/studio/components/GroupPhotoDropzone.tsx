/**
 * GroupPhotoDropzone — drop zone for uploading a group photo.
 */
import type { RefObject } from "react";
import { ACCEPT } from "../config";
import type { Slot } from "../hooks/useImageUpload";

export function GroupPhotoDropzone(props: {
  groupFileRef: RefObject<HTMLInputElement | null>;
  accept: (file: File, slot: Slot) => void;
  groupFileOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      className="border-2 border-dashed border-green/45 rounded-2xl bg-green/[0.05] px-[18px] py-[30px] text-center cursor-pointer transition-[background,border-color] duration-180"
      tabIndex={0}
      role="button"
      aria-label="Add your group photo"
      onClick={() => props.groupFileRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          props.groupFileRef.current?.click();
        }
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) props.accept(f, "group");
      }}
    >
      <b className="block text-lg tracking-[-0.01em]">Add your group photo</b>
      <span className="block font-mono text-[10.5px] text-ink/60 mt-[7px]">Everyone already together in one shot</span>
    </div>
  );
}