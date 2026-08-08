import type { Metadata } from "next";
import Link from "next/link";
import { CAPTION } from "@/lib/tokens";

type Props = { params: Promise<{ id: string }> };

/**
 * Ids are the blob URL, base64url encoded. No database: the id *is* the
 * pointer. Decoding is validated against the Vercel Blob host so this route
 * cannot be turned into an open image proxy for arbitrary URLs.
 */
function decode(id: string): string | null {
  try {
    const url = Buffer.from(id, "base64url").toString("utf8");
    const parsed = new URL(url);
    const ok =
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".public.blob.vercel-storage.com");
    return ok ? url : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const image = decode(id);
  const title = "Frame In Goa — Hacker House Goa 2026";
  const description = "28–31 Oct · Goa · 247 builders, one house. #FrameInGoa";

  if (!image) {
    return { title, description };
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1080, height: 1350, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function SharedFrame({ params }: Props) {
  const { id } = await params;
  const image = decode(id);

  return (
    <main className="relative z-10 max-w-[520px] mx-auto px-[18px] py-10 text-center">
      {image ? (
        <img src={image} alt="Hacker House Goa 2026 frame" className="w-full rounded-xl shadow-deep" />
      ) : (
        <p className="font-mono text-xs text-cream/70 my-[22px]">
          That link has expired or was never valid.
        </p>
      )}
      <p className="font-mono text-xs text-cream/70 my-[22px]">
        {CAPTION.split("\n")[0]}
      </p>
      <Link
        className="inline-block bg-pink text-white font-mono text-xs font-bold tracking-[0.1em] uppercase no-underline px-[26px] py-[15px] rounded-xl"
        href="/"
      >
        Make your own
      </Link>
    </main>
  );
}
