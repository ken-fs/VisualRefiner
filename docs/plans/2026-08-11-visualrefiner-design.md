# VisualRefiner MVP Design

Date: 2026-08-11

## Product boundary

VisualRefiner launches as an English-first collection of browser-local image and video tools. The first release covers common image conversion, compression and resizing, plus video conversion, frame extraction and video-to-GIF. Files are never uploaded by these tools. AI enhancement, inpainting, accounts, payments, server storage, YouTube downloading and dedicated watermark-removal pages are outside this milestone.

The homepage must work as both a product explanation and the quickest path into a real task. Format-specific SEO routes share processing components; they are not separate implementations. Each route needs unique task guidance, supported formats, limitations and recovery instructions rather than interchangeable keyword copy.

## Experience architecture

The first viewport is an inspection bench, not a marketing hero. A large working surface holds the file action, accepted formats and a visible local-processing path. Navigation behaves like a tool index. The page then moves through an irregular job list, an explicit privacy diagram and concise format guidance.

Tool pages use the same bench grammar with four states: empty, configured, processing and result. Errors name the unsupported file or browser capability and provide a next action. Downloads remain local object URLs and are revoked when replaced or the component unmounts.

## Visual direction

The durable world is a precision inspection table: pale celadon-grey work surfaces, graphite type, calibration orange for actions, restrained yellow for warnings, registration marks, crop ticks and a movable inspection lens. The interface avoids decorative cards, neon AI styling and blue-purple gradients. Display typography is compact and mechanical without using monospace as costume; body text stays highly readable.

The signature moment is the file crossing into the inspection field: the lens and registration marks settle around it while a short local path shows `file → browser → download`. Reduced-motion mode removes the settling motion without hiding content.

## Architecture

- Next.js App Router, React and TypeScript.
- Static export for Cloudflare hosting.
- pnpm with a committed `pnpm-lock.yaml`.
- Browser-native Canvas APIs for common image formats.
- `pica` only where higher-quality resizing is needed.
- `heic2any` isolated behind a lazy adapter for HEIC input.
- MediaBunny loaded dynamically for video conversion and frame extraction.
- `gifenc` used only by video-to-GIF.
- No database, authentication, API routes or server runtime in the MVP.

## Verification

- Unit checks for shared file naming and image option calculations.
- Manual functional checks with small JPG, PNG, WebP and MP4 fixtures.
- `pnpm lint` and `pnpm build` must pass.
- Desktop and mobile visual inspection must cover empty, error and result states.
- Production output must contain canonical metadata, sitemap, robots.txt and the design-direction contract.
