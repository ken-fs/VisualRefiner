export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  hook: string;
  datePublished: string;
};

export const guides: GuideMeta[] = [
  {
    slug: "/guides/webp-vs-png",
    title: "WebP vs PNG: which should you use?",
    description: "When to keep PNG and when WebP saves size without hurting quality.",
    hook: "Transparency, file size, and support — a plain answer.",
    datePublished: "2026-08-12",
  },
  {
    slug: "/guides/heic-explained",
    title: "What is HEIC, and how do you open it?",
    description: "Why iPhone photos are HEIC and how to convert them to a format anything can open.",
    hook: "The iPhone photo format, explained without jargon.",
    datePublished: "2026-08-12",
  },
  {
    slug: "/guides/image-compression-quality",
    title: "What compression quality should you use?",
    description: "How the quality percentage works and where to set it for photos and graphics.",
    hook: "Where to put the slider, and why 82% is a good start.",
    datePublished: "2026-08-12",
  },
  {
    slug: "/guides/mp4-vs-webm",
    title: "MP4 vs WebM: which video format?",
    description: "The difference between MP4 and WebM and when to pick each for the web.",
    hook: "Compatibility versus modern-web efficiency.",
    datePublished: "2026-08-12",
  },
  {
    slug: "/guides/remove-image-metadata",
    title: "How to remove metadata (EXIF) from a photo",
    description: "What EXIF and GPS metadata a photo carries, why it matters for privacy, and how to strip it without uploading the image.",
    hook: "The hidden data in your photos — and how to clear it.",
    datePublished: "2026-08-22",
  },
  {
    slug: "/guides/avif-vs-webp",
    title: "AVIF vs WebP: which modern image format?",
    description: "How AVIF and WebP compare on size, quality, and browser support, and when each is the right pick.",
    hook: "Two modern formats, one practical choice.",
    datePublished: "2026-08-22",
  },
  {
    slug: "/guides/video-metadata",
    title: "What metadata does a video file carry?",
    description: "The hidden fields inside MP4, MOV, MKV, and WebM files — device info, editing history, AIGC labels — and how to strip them without re-encoding.",
    hook: "Your videos have a paper trail too.",
    datePublished: "2026-08-31",
  },
  {
    slug: "/guides/remove-metadata-iphone-photos",
    title: "How to remove metadata from iPhone photos",
    description: "iPhone photos carry EXIF and GPS metadata. How to see what's embedded, strip it before sharing, and stop recording it — without uploading the photo.",
    hook: "Your iPhone photos remember where you took them.",
    datePublished: "2026-09-03",
  },
  {
    slug: "/guides/what-is-c2pa",
    title: "What is C2PA? Content Credentials explained",
    description: "How the C2PA standard embeds a signed origin record into images and video, what it can tell you about AI-generated content, and what it can't prove.",
    hook: "The nutrition label for digital content.",
    datePublished: "2026-08-31",
  },
];

// Maps a tool slug to the guides worth reading alongside it. Used to build the
// "Related guides" block on tool pages so every tool links into the topic cluster.
const toolGuideMap: Record<string, string[]> = {
  "/image-converter": ["/guides/webp-vs-png"],
  "/image-compressor": ["/guides/image-compression-quality", "/guides/webp-vs-png"],
  "/image-resizer": ["/guides/image-compression-quality"],
  "/video-converter": ["/guides/mp4-vs-webm"],
  "/extract-video-frames": ["/guides/mp4-vs-webm"],
  "/video-to-gif": ["/guides/mp4-vs-webm"],
  "/png-to-jpg": ["/guides/webp-vs-png"],
  "/jpg-to-png": ["/guides/webp-vs-png"],
  "/png-to-webp": ["/guides/webp-vs-png"],
  "/jpg-to-webp": ["/guides/webp-vs-png", "/guides/image-compression-quality"],
  "/webp-to-png": ["/guides/webp-vs-png"],
  "/webp-to-jpg": ["/guides/webp-vs-png"],
  "/heic-to-jpg": ["/guides/heic-explained", "/guides/remove-metadata-iphone-photos", "/guides/webp-vs-png"],
  "/heic-to-png": ["/guides/heic-explained"],
  "/heic-to-webp": ["/guides/heic-explained", "/guides/webp-vs-png"],
  "/mov-to-mp4": ["/guides/mp4-vs-webm"],
  "/mkv-to-mp4": ["/guides/mp4-vs-webm"],
  "/webm-to-mp4": ["/guides/mp4-vs-webm"],
  "/mp4-to-webm": ["/guides/mp4-vs-webm"],
  "/mov-to-webm": ["/guides/mp4-vs-webm"],
  "/mkv-to-webm": ["/guides/mp4-vs-webm"],
  "/remove-metadata": ["/guides/remove-image-metadata", "/guides/remove-metadata-iphone-photos", "/guides/what-is-c2pa"],
  "/remove-video-metadata": ["/guides/video-metadata"],
  "/check-image-origin": ["/guides/what-is-c2pa", "/guides/remove-image-metadata"],
  "/erase-object": ["/guides/remove-image-metadata"],
  "/image-cropper": ["/guides/image-compression-quality"],
  "/trim-video": ["/guides/mp4-vs-webm"],
};

export function relatedGuides(toolSlug: string): GuideMeta[] {
  return (toolGuideMap[toolSlug] ?? [])
    .map((slug) => guides.find((g) => g.slug === slug))
    .filter((g): g is GuideMeta => Boolean(g));
}
