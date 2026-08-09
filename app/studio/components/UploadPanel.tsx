/**
 * UploadPanel — file drop zone + "take a selfie" button.
 */
import { type RefObject } from "react";
import { ACCEPT } from "../config";
import type { Slot } from "../hooks/useImageUpload";

export function UploadPanel(props: {
  fileRef: RefObject<HTMLInputElement | null>;
  accept: (file: File, slot: Slot) => void;
  startCamera: () => void;
  status: string | null;
}) {
  return (
    <div className="bg-cream text-ink rounded-[22px] p-[18px] shadow-deep mb-4">
      <p className="font-mono text-[10px] font-bold tracking-[0.16em] uppercase text-pink mb-[10px]">
        Step 1 — your photo
      </p>
      <div
       className="
  border-2
  border-dashed
  border-green/50
  rounded-2xl
  bg-cream/45
  px-[18px]
  py-[30px]
  text-center
  cursor-pointer
  transition-[background,border-color]
  duration-180
  hover:bg-cream/70
  hover:border-pink
"
        tabIndex={0}
        role="button"
        aria-label="Add a photo"
        onClick={() => props.fileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            props.fileRef.current?.click();
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) props.accept(f, "solo");
        }}
      >
        <b className="block text-lg tracking-[-0.01em]">Add a photo</b>
        <span className="block font-mono text-[10.5px] text-ink/60 mt-[7px]">
          JPG · PNG · HEIC · WEBP — no crop needed
        </span>
      </div>
      <div className="grid gap-[10px] mt-4">
        <button
          className="appearance-none border-0 rounded-xl px-4 py-3 cursor-pointer font-mono text-xs font-bold tracking-[0.1em] uppercase text-center no-underline active:translate-y-px transition-transform duration-120 disabled:opacity-40 disabled:cursor-not-allowed bg-transparent text-ink/55 border border-green/25"
          onClick={() => props.startCamera()}
        >
          Or take a selfie
        </button>
      </div>
      {props.status && (
        <p className="font-mono text-[10.5px] leading-relaxed text-pink mt-3">{props.status}</p>
      )}
      <input ref={props.fileRef} type="file" accept={ACCEPT} hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) props.accept(f, "solo");
          e.target.value = "";
        }}
      />
    </div>
  );
}