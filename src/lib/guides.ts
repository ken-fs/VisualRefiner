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
  "/heic-to-jpg": ["/guides/heic-explained", "/guides/webp-vs-png"],
  "/heic-to-png": ["/guides/heic-explained"],
  "/heic-to-webp": ["/guides/heic-explained", "/guides/webp-vs-png"],
  "/mov-to-mp4": ["/guides/mp4-vs-webm"],
  "/mkv-to-mp4": ["/guides/mp4-vs-webm"],
  "/webm-to-mp4": ["/guides/mp4-vs-webm"],
};

export function relatedGuides(toolSlug: string): GuideMeta[] {
  return (toolGuideMap[toolSlug] ?? [])
    .map((slug) => guides.find((g) => g.slug === slug))
    .filter((g): g is GuideMeta => Boolean(g));
}
