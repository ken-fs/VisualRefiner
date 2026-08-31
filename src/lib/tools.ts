export type ToolGroup = "image" | "video";

export type ToolDefinition = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  formats: string;
  group: ToolGroup;
  available: boolean;
};

export const tools: ToolDefinition[] = [
  {
    slug: "/image-converter",
    name: "Image converter",
    shortName: "Convert",
    description: "Switch between JPG, PNG, and WebP.",
    formats: "JPG · PNG · WebP · HEIC",
    group: "image",
    available: true,
  },
  {
    slug: "/image-compressor",
    name: "Image compressor",
    shortName: "Compress",
    description: "Shrink an image with a visible quality control.",
    formats: "JPG · WebP",
    group: "image",
    available: true,
  },
  {
    slug: "/image-resizer",
    name: "Image resizer",
    shortName: "Resize",
    description: "Set a new size without stretching the image.",
    formats: "JPG · PNG · WebP",
    group: "image",
    available: true,
  },
  {
    slug: "/image-cropper",
    name: "Image cropper",
    shortName: "Crop",
    description: "Crop to a selection or an exact aspect ratio.",
    formats: "JPG · PNG · WebP",
    group: "image",
    available: true,
  },
  {
    slug: "/remove-metadata",
    name: "Metadata remover",
    shortName: "Strip data",
    description: "Remove EXIF and GPS data from a photo.",
    formats: "JPG · PNG · WebP",
    group: "image",
    available: true,
  },
  {
    slug: "/video-converter",
    name: "Video converter",
    shortName: "Convert video",
    description: "Convert supported videos to MP4 or WebM.",
    formats: "MP4 · MOV · WebM · MKV",
    group: "video",
    available: true,
  },
  {
    slug: "/extract-video-frames",
    name: "Frame extractor",
    shortName: "Extract frames",
    description: "Save evenly spaced frames from a video.",
    formats: "PNG frames",
    group: "video",
    available: true,
  },
  {
    slug: "/video-to-gif",
    name: "Video to GIF",
    shortName: "Make a GIF",
    description: "Turn a short clip into a looping GIF.",
    formats: "Video → GIF",
    group: "video",
    available: true,
  },
  {
    slug: "/trim-video",
    name: "Video trimmer",
    shortName: "Trim",
    description: "Cut a clip to a start and end point.",
    formats: "MP4 · WebM",
    group: "video",
    available: true,
  },
];

// Sibling tools in the same group (image/video), used to cross-link tool pages.
// Without this, a tool page's only internal links are the homepage grid and its
// related guide — too thin for new pages to get crawled and indexed.
export function relatedTools(slug: string): ToolDefinition[] {
  const current = tools.find((t) => t.slug === slug);
  if (!current) return [];
  return tools.filter((t) => t.slug !== slug && t.group === current.group && t.available);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export function outputName(name: string, suffix: string, extension: string) {
  const base = name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-");
  return `${base || "visual"}-${suffix}.${extension}`;
}
