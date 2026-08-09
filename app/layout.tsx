import type { Metadata, Viewport } from "next";
// Next.js loads this stylesheet at runtime; its module declaration is provided by the build pipeline.
// @ts-expect-error CSS side-effect imports are handled by Next.js.
import "./globals.css";

const title = "Frame In Goa — Hacker House Goa 2026";
const description =
  "Drop a photo, get an HH Goa 2026 profile frame, builder ID or team post. Download it, post it. #FrameInGoa";

/**
 * Resolves the real deployed URL rather than guessing at a project name.
 * Priority: explicit override → Vercel's own production-domain system var
 * (needs "system environment variables" enabled in project settings to be
 * populated) → localhost for local dev. Getting this wrong doesn't break the
 * app — it breaks the X link preview, silently, which is worse.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-default.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B6839",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
