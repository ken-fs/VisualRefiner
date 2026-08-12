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
