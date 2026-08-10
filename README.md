# Frame In Goa

A photo goes in, a branded Hacker House Goa 2026 graphic comes out. No login, no
signup, no crop step. Four formats: profile frame, builder ID card, X banner, and
a combined team post.

Built this for HH Goa 2026 — mostly because the brief was a genuinely fun one to
sink into. Frames, photo booths, arc typography, the "will this survive X cropping
it to a circle" puzzle — it's the kind of small, self-contained problem that's
satisfying to actually finish properly rather than leave 80% done. **#FrameInGoa**

---

## The decisions worth explaining

Nothing here is exotic — it's mostly the boring, unglamorous parts of "make a
photo tool that actually works on a stranger's phone" that don't show up in a
demo gif but are the whole game once real people start uploading real photos.
Writing them down here because they were the fun part to get right.

### The profile frame is built for a circle, not a square

X crops avatars to a circle and throws the corners away. A frame that puts its
wordmark in the corners looks finished in the download and empty on the actual
profile — which is the only place it matters.

So the event name and dates ride arcs *inside* the inscribed circle, and the
corners carry only a secondary mark that appears when the same file is posted as
a square image. One render, correct in both contexts.

Getting arc text right turned out to be two coupled problems, not one: glyphs on
the bottom half must rotate the opposite way to stay upright, *and* the run must
travel anticlockwise to still read left to right. Fixing only one produces text
that is mirrored or upside down. See `arcText` in `lib/canvas.ts`.

### Sideways iPhone photos

`createImageBitmap(blob, { imageOrientation: "from-image" })` applies the EXIF
rotation tag at decode time. Without it, portrait photos from an iPhone arrive
rotated 90° and every frame is wrong for the largest single group of users.

### HEIC is loaded on demand, not up front

`heic2any` is around a megabyte. It is behind a dynamic `import()` so it only
downloads when someone actually picks a HEIC file. Everyone else pays nothing.

### Uploads are capped at 2400px before anything touches them

Nothing rendered here exceeds 1500px on its longest edge, so pixels beyond that
are pure memory cost. A current iPhone shoots 48MP; decoded, that is roughly
200MB of bitmap, which is where a mid-range Android runs out of memory and the
tab dies. The downscale happens once, immediately after decode.

### Layouts are computed from both edges inward

The ID card and the team grid size themselves from a vertical budget rather than
stacking blocks downward from the top. On a fixed-size badge an overflow is
silent — it just pushes the name off the card — so the constraint is expressed
directly in the code.

### Name tags are dragged in HTML, baked in canvas

The team tab's group-photo mode lets you drop one already-together photo and
pin translucent name tags anywhere on it. Editing them — drag to reposition,
type to rename — happens as real, boring HTML elements laid over the canvas at
percentage coordinates, because reimplementing text hit-testing and dragging
*inside* a canvas is real effort for something the DOM already does for free.
The canvas itself never draws the tags during editing.

At export, the tags are gone from the DOM entirely — a second pass
(`drawNameTags`) bakes each one into the full-resolution canvas from nothing
but its stored text and fractional (x, y) position. Two renderers, same data,
no duplicated logic: `lib/render/team-group.ts` for the photo and frame,
one small function for the tags on top.

Team size — both the individual-photos grid and group-photo tags — is capped
at 3, matching the actual submission form, which only has fields for three
teammates.

### Redraws are throttled to one per animation frame

`pointermove` fires far faster than the display refreshes, and the ID card is a
~1MP fill each time. Coalescing to `requestAnimationFrame` is the difference
between a smooth drag and a stuttering one on a mid-range phone.

### Share does the honest thing on each platform

On mobile, `navigator.share({ files })` hands the PNG straight to the X composer
with the caption already written. Desktop has no equivalent API, so the file is
saved and a **second button** appears that the user clicks themselves. Opening a
window on a timer would be swallowed by popup blockers, because by then the user
gesture has expired.

If blob storage is configured, the desktop path also uploads the render and
shares a `/p/<id>` link whose OG image is the actual graphic — the task calls out
blank link previews as a named failure.

### What was deliberately left out

**Background removal.** In-browser cutout demos beautifully and would've been
the most fun-to-show-off addition here. It's also a multi-megabyte model
download and several seconds of compute on a cheap phone, against a brief
whose first requirement is that this feels near-instant. Tempting, but the
wrong trade.

**A model call for builder titles.** Would've added a round trip, an API key
and a failure mode, to produce something no better than a seeded lookup.
`lib/titles.ts` is deterministic instead — same person, same badge, every time.

### Tailwind CSS replaced custom styles

The original `globals.css` defined every visual rule in custom classes. Most of
those have been replaced with Tailwind utility classes, configured in
`tailwind.config.ts` using the same brand colours (`green`, `cream`, `pink`,
`deep`, `ink`) and fonts (`font-display`, `font-mono`) that the canvas renderers
use. The handful of rules with no clean Tailwind equivalent — `body::before`
gradient, range slider thumbs, draggable tag pills, `prefers-reduced-motion` —
live in `globals.css` under `@layer base` and `@layer components` with comments
explaining why each one stayed.

### Studio.tsx was modularized

The single client app originally ran 885 lines. It was split into six custom
hooks (camera, image upload, drag, name tags, preview render, export) and
fourteen UI components, bringing the main file down to ~420 lines. Each hook
has one clear responsibility, shared refs are created once in the orchestrator
and passed in, and `scheduleRender` is owned by a single hook
(`usePreviewRender`) that all other hooks receive as a callback.

---

## Structure

```
app/
  Studio.tsx                thin orchestrator — ~420 lines, composes hooks + components
  page.tsx                  entry
  layout.tsx                fonts + metadata
  globals.css               Tailwind directives + residual custom rules
  p/[id]/page.tsx           shared link, per-graphic OG image
  api/upload/route.ts       optional blob storage
  studio/
    config.ts               types and constants — Mode, FilterPreset, MAX_TEAM, etc.
    hooks/
      useCameraCapture.ts   camera lifecycle — start/stop/capture
      useImageUpload.ts     file → HEIC → downscale → ref routing
      useImageDrag.ts       solo + group photo drag-to-reposition
      useNameTags.ts        draggable name tag state + pointer handlers
      usePreviewRender.ts   paint dispatcher, rAF-throttled render loop, font loading
      useExport.ts          export-to-blob, download, share-to-X, QR share URL
    components/
      Header.tsx            HH GOA logo + date stamp + tagline
      FormatTabs.tsx        Profile / Builder ID / Banner / Team switcher
      UploadPanel.tsx       file drop zone + camera button
      TeamModeTabs.tsx      "Individual photos" / "Group photo" subtabs
      GroupPhotoDropzone.tsx  group photo upload zone
      PreviewStage.tsx      canvas element + name-tag overlays + hints + busy overlay
      ZoomSlider.tsx        range input for photo zoom
      RotateControl.tsx     90° rotate button (cycles 0→90→180→270→0)
      FilterSelector.tsx    photo filter presets — None / Warm / Mono / Vivid
      ColorwaySelector.tsx  PFP frame colourway buttons
      IdFormFields.tsx      name / role / builder title inputs + reroll
      TeamSlots.tsx         3×3 add/remove photo grid + team names input
      NameTagEditor.tsx     group tag input rows + add/remove buttons
      ExportControls.tsx    Share to X / Download / Different photo buttons
      StatusFooter.tsx      manual link button + render-timing status
      ShareQrCode.tsx       QR code for the shareable /p/<id> link
      Footer.tsx            brand credit + link
lib/
  render/pfp.ts             Format A — profile frame (1024×1024)
  render/id.ts              Format B — builder ID card (1080×1350, 4:5)
  render/banner.ts          Format C — X banner (1500×500, 3:1)
  render/team.ts            Format D — team post, individual photo grid (1200×1200)
  render/team-group.ts      Format D — team post, group photo + name tags (1200×1200)
  canvas.ts                 rr, arcText, fitFont, drawCover, gridPattern
  image.ts                  HEIC, EXIF, downscale guard
  share.ts                  navigator.share + desktop fallback
  titles.ts                 seeded builder titles and resident numbers
  tokens.ts                 brand colours, type, colourways
  png-meta.ts               tEXt provenance metadata injection
scripts/
  smoke.mjs                 renders every format headlessly to smoke/
  og.mjs                    builds public/og-default.png
```

Every renderer has the same shape: `draw(ctx, size, image, focus, ...)`, in
normalised units. Preview and export call the identical function at different
## Stack

| What | Version |
|------|---------|
| Next.js (App Router) | 15.1.9 |
| React | 19.0.0 |
| TypeScript | 5.7.3 |
| Tailwind CSS | 3.4.19 |
| qrcode | 1.5.4 |
| heic2any (lazy-loaded) | 0.0.4 |
| @napi-rs/canvas (headless smoke tests) | 1.0.3 |
| @vercel/blob (optional share links) | 0.27.0 |

## Features

### Four export formats

| Format | Dimensions | File |
|--------|-----------|------|
| Profile frame (PFP) | 1024×1024 | `lib/render/pfp.ts` |
| Builder ID card | 1080×1350 (4:5) | `lib/render/id.ts` |
| X banner | 1500×500 (3:1) | `lib/render/banner.ts` |
| Team post — individual grid | 1200×1200 | `lib/render/team.ts` |
| Team post — group photo | 1200×1200 | `lib/render/team-group.ts` |

### Photo input

- **File upload** — click or drag-and-drop onto the drop zone
- **Camera capture** — front-facing camera stream, snap a still
- **HEIC support** — lazy-loaded `heic2any` converts on the fly
- **EXIF orientation** — `createImageBitmap` with `imageOrientation: "from-image"`
- **Downscale guard** — images are capped at 2400px longest edge on load

### Photo editing

| Control | Applies to | How |
|---------|-----------|-----|
| Zoom | Solo + group photo | Range slider, stored in `focus.z` |
| Drag to reposition | Solo + group photo | Pointer drag, updates `focus.x` / `focus.y` |
| Rotate (90° increments) | Solo + group photo | Cycles 0° → 90° → 180° → 270° → 0°, stored in `focus.r` |
| Filter presets | Solo + group photo | None / Warm (sepia) / Mono (b&w) / Vivid (saturate+contrast) |

Rotate and filters apply to the solo photo and the group-photo mode only — the
per-slot team grid (individual photo mode) is not affected.

### Share

- **Mobile** — native OS share sheet hands the PNG and caption directly to X
- **Desktop** — downloads the PNG and opens an X composer with the caption
  pre-filled (the user attaches the image manually)
- **Share link** — when `BLOB_READ_WRITE_TOKEN` is configured, the file is uploaded
  to Vercel Blob and the share link includes a preview; the `/p/<id>` route serves
  the OG image so the link preview actually shows the graphic
- **QR code** — after a successful share-link upload, a QR code appears below the
  editor card encoding the `/p/<id>` URL. Scannable at the event; absent when blob
  storage is not configured.
resolutions, so what you see is exactly what downloads.

## Running it

```bash
npm install
npm run dev
```

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run start      # start production server
npm run lint       # next lint
node scripts/smoke.mjs   # render every format to smoke/ and eyeball it
```

The smoke script renders each format headlessly with `@napi-rs/canvas`. It found
three real layout bugs that were invisible from reading the code — mirrored arc
text, an ID card whose photo pushed the name off the bottom, and team captions
colliding with the footer.

## Configuration

Everything works with no environment variables. `BLOB_READ_WRITE_TOKEN`
(Vercel Blob) is optional and enables:
- The link-preview share path (the `/p/<id>` page's OG image)
- The QR code shown after share (which encodes that same `/p/<id>` URL)

Without it the API route returns 501, the client falls back to attaching the file
directly, and no QR code is shown — the same graceful-degradation pattern the
app has always used.

## Brand

Colours are sampled from hhgoa.com and the official task card: deep green
`#0B6839`, cream `#FFFBE8`, hot pink `#FF0080`. The four frame colourways are
named after the four days on the HH Goa agenda — Genesis, Triangle, Build,
Launch. All brand values live in `lib/tokens.ts`.

## Provenance

MIT licensed, copyright Abhisek. Every exported PNG carries an embedded
`tEXt` metadata chunk identifying the original build and repo — invisible in
the image, readable with any PNG metadata tool. See `lib/png-meta.ts`.

## Browser support

Chrome, Safari, Firefox, and mobile equivalents. `roundRect` is avoided in favour
of `arcTo` for older Safari, video dimensions are duck-typed rather than
`instanceof`-checked, and `ImageBitmap`s are explicitly closed when photos are
swapped so repeated use does not leak GPU memory.

---

Made this because Hacker House Goa looks like the kind of room worth being in —
excited for whatever comes after this task, frame or no frame. See you on the
sand in October. 🌊
