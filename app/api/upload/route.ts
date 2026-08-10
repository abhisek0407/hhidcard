// import { put } from "@vercel/blob";
// import { NextResponse } from "next/server";

// export const runtime = "nodejs";

// const MAX_BYTES = 6 * 1024 * 1024;

// /**
//  * Optional. Stores a rendered PNG so a shared link can carry a real preview
//  * image. Without BLOB_READ_WRITE_TOKEN this returns 501 and the client quietly
//  * falls back to attaching the file directly, which is what mobile does anyway.
//  */
// export async function POST(request: Request) {

//   const body = await request.arrayBuffer();
//   if (!body.byteLength || body.byteLength > MAX_BYTES) {
//     return NextResponse.json({ error: "Image missing or too large" }, { status: 400 });
//   }

//   const key = `frames/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}.png`;
//   const { url } = await put(key, Buffer.from(body), {
//     access: "public",
//     contentType: "image/png",
//     addRandomSuffix: false,
//   });

//   const id = Buffer.from(url).toString("base64url");
//   return NextResponse.json({ url, id, share: `/p/${id}` });
// }
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 6 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const body = await request.arrayBuffer();

    if (!body.byteLength) {
      return NextResponse.json(
        { error: "Image missing" },
        { status: 400 }
      );
    }

    if (body.byteLength > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image too large" },
        { status: 400 }
      );
    }

    const key = `frames/${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 9)}.png`;

    const blob = await put(key, Buffer.from(body), {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: false,
    });

    const id = Buffer.from(blob.url).toString("base64url");

    return NextResponse.json({
      url: blob.url,
      id,
      share: `/p/${id}`,
    });
  } catch (error) {
    console.error("Vercel Blob upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload image",
      },
      { status: 500 }
    );
  }
}