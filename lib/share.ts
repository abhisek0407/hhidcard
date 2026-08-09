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


export async function shareImage(
  blob: Blob,
  filename: string,
): Promise<ShareResult> {
  
  return "needs-manual";
}

export async function uploadForLink(
  blob: Blob,
): Promise<string | null> {
  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: blob,
      headers: {
        "Content-Type": "image/png",
      },
    });

    if (!res.ok) {
      console.error("Upload failed:", res.status);
      return null;
    }

    const data = (await res.json()) as {
      url?: string;
    };

    return data.url ?? null;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}