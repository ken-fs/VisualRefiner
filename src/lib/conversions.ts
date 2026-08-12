export type Conversion = {
  slug: string;
  label: string;
  group: "image" | "video";
};

// Format-specific converter landing pages. Each reuses the shared processing
// engine; this list is the single source for internal links and the sitemap.
export const conversions: Conversion[] = [
  { slug: "/png-to-jpg", label: "PNG to JPG", group: "image" },
  { slug: "/jpg-to-png", label: "JPG to PNG", group: "image" },
  { slug: "/png-to-webp", label: "PNG to WebP", group: "image" },
  { slug: "/jpg-to-webp", label: "JPG to WebP", group: "image" },
  { slug: "/webp-to-png", label: "WebP to PNG", group: "image" },
  { slug: "/webp-to-jpg", label: "WebP to JPG", group: "image" },
  { slug: "/heic-to-jpg", label: "HEIC to JPG", group: "image" },
  { slug: "/heic-to-png", label: "HEIC to PNG", group: "image" },
  { slug: "/heic-to-webp", label: "HEIC to WebP", group: "image" },
  { slug: "/mov-to-mp4", label: "MOV to MP4", group: "video" },
  { slug: "/mkv-to-mp4", label: "MKV to MP4", group: "video" },
  { slug: "/webm-to-mp4", label: "WebM to MP4", group: "video" },
];
