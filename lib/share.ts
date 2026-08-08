import { CAPTION } from "./tokens";

export type ShareResult = "shared" | "cancelled" | "needs-manual";

export const tweetUrl = (extra?: string) =>
  "https://x.com/intent/post?text=" +
  encodeURIComponent(CAPTION) +
  (extra ? "&url=" + encodeURIComponent(extra) : "");

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Mobile gets the real thing: the PNG is handed to the X composer with the
 * caption already written. Desktop has no equivalent API, so we save the file
 * and return "needs-manual" — the caller then shows a second button the user
 * clicks themselves. Opening a window on a timer here would be swallowed by
 * popup blockers, because the user gesture has already expired.
 */
export async function shareImage(blob: Blob, filename: string): Promise<ShareResult> {
  const file = new File([blob], filename, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text: CAPTION });
      return "shared";
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return "cancelled";
    }
  }
  saveBlob(blob, filename);
  return "needs-manual";
}

/** Optional link path. Only works when blob storage is configured. */
export async function uploadForLink(blob: Blob): Promise<string | null> {
  try {
    const res = await fetch("/api/upload", { method: "POST", body: blob });
    if (!res.ok) return null;
    const { url } = (await res.json()) as { url?: string };
    return url ?? null;
  } catch {
    return null;
  }
}
