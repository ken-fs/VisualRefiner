/**
 * Local metadata inspection and lossless stripping for JPEG, PNG, and WebP.
 *
 * The strip functions rebuild the file container and drop metadata segments
 * without touching the encoded pixels — unlike the canvas re-encode path, the
 * image data survives byte-for-byte. Color-critical segments (ICC profiles,
 * gAMA/sRGB, Adobe APP14) are kept; privacy-relevant and provenance segments
 * (EXIF, XMP, IPTC, C2PA/JUMBF, comments, text chunks) are removed.
 */

export type ScanReport = {
  container: "jpeg" | "png" | "webp" | "other";
  /** Individual metadata blocks found in the file structure. */
  blocks: MetadataBlock[];
  hasGps: boolean;
  /** EXIF orientation (1–8) when known; null when absent or unreadable. */
  orientation: number | null;
  /** Matched AI-generator fingerprints found in metadata values. */
  aiSignals: string[];
  /** A handful of human-readable fields for display. */
  fields: { label: string; value: string }[];
};

export type MetadataBlock =
  | "EXIF"
  | "XMP"
  | "IPTC"
  | "ICC profile"
  | "C2PA credentials"
  | "Comment"
  | "Text data"
  | "Maker notes";

export type StripResult = {
  data: Uint8Array;
  removed: MetadataBlock[];
  lossless: boolean;
};

const textDecoder = new TextDecoder();

function ascii(view: DataView, start: number, length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) out += String.fromCharCode(view.getUint8(start + i));
  return out;
}

/* ------------------------------------------------------------------ */
/* JPEG                                                                */
/* ------------------------------------------------------------------ */

type JpegSegment = { marker: number; start: number; length: number };

function* jpegSegments(view: DataView): Generator<JpegSegment> {
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return;
  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint8(offset + 1);
    if (marker === 0xda) {
      yield { marker, start: offset, length: view.byteLength - offset }; // SOS: scan data to EOF
      return;
    }
    const size = view.getUint16(offset + 2);
    yield { marker, start: offset, length: 2 + size };
    offset += 2 + size;
  }
}

function isJpegC2pa(view: DataView, payloadStart: number): boolean {
  // APP11 JUMBF carrier: identifier "JP" (ISO 19566-5).
  return ascii(view, payloadStart, 2) === "JP";
}

export function scanJpegStructure(buffer: ArrayBuffer): {
  blocks: MetadataBlock[];
  hasC2pa: boolean;
} {
  const view = new DataView(buffer);
  const found = new Set<MetadataBlock>();
  let hasC2pa = false;
  for (const seg of jpegSegments(view)) {
    const payload = seg.start + 4;
    if (payload + 12 > view.byteLength) continue; // need room for signatures
    if (seg.marker === 0xe1) {
      if (view.getUint32(payload) === 0x45786966) found.add("EXIF"); // "Exif"
      else if (ascii(view, payload, 4) === "http") found.add("XMP");
    } else if (seg.marker === 0xe2) {
      if (ascii(view, payload, 4) === "ICC_") found.add("ICC profile");
    } else if (seg.marker === 0xeb) {
      if (isJpegC2pa(view, payload)) {
        hasC2pa = true;
        found.add("C2PA credentials");
      }
    } else if (seg.marker === 0xed) {
      if (ascii(view, payload, 9) === "Photoshop") found.add("IPTC");
    } else if (seg.marker === 0xfe) {
      found.add("Comment");
    }
  }
  return { blocks: [...found], hasC2pa };
}

/**
 * Removes metadata segments from a JPEG without re-encoding. Keeps the pixel
 * scan verbatim and preserves color-critical APP segments. Note: the EXIF
 * orientation tag is dropped without rotating pixels, so callers should only
 * use this when the image's orientation is already normal (1) or unknown.
 */
export function stripJpegMetadata(buffer: ArrayBuffer): StripResult {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) {
    throw new Error("Not a JPEG file.");
  }
  const source = new Uint8Array(buffer);
  const kept: Uint8Array[] = [source.subarray(0, 2)]; // SOI
  const removed = new Set<MetadataBlock>();

  for (const seg of jpegSegments(view)) {
    const payload = seg.start + 4;
    let keep = true;
    if (seg.marker === 0xda) {
      keep = true; // SOS + all scan data to EOF
    } else if (seg.marker >= 0xe0 && seg.marker <= 0xef) {
      // APPn whitelist: APP0 (JFIF), APP2 ICC, APP14 (Adobe color transform).
      keep = false;
      const readable = payload + 12 <= view.byteLength;
      if (seg.marker === 0xe0) keep = true;
      else if (seg.marker === 0xe2 && readable && ascii(view, payload, 4) === "ICC_") keep = true;
      else if (seg.marker === 0xee) keep = true;
      else if (readable) {
        if (seg.marker === 0xe1) {
          removed.add(view.getUint32(payload) === 0x45786966 ? "EXIF" : "XMP");
        } else if (seg.marker === 0xeb && isJpegC2pa(view, payload)) {
          removed.add("C2PA credentials");
        } else if (seg.marker === 0xed) {
          removed.add("IPTC");
        }
      }
    } else if (seg.marker === 0xfe) {
      keep = false;
      removed.add("Comment");
    }
    if (keep) kept.push(source.subarray(seg.start, seg.start + seg.length));
  }

  const total = kept.reduce((n, part) => n + part.length, 0);
  const out = new Uint8Array(total);
  let at = 0;
  for (const part of kept) {
    out.set(part, at);
    at += part.length;
  }
  return { data: out, removed: [...removed], lossless: true };
}

/* ------------------------------------------------------------------ */
/* PNG                                                                 */
/* ------------------------------------------------------------------ */

const PNG_DROP_CHUNKS: Record<string, MetadataBlock> = {
  tEXt: "Text data",
  zTXt: "Text data",
  iTXt: "Text data",
  eXIf: "EXIF",
  caBX: "C2PA credentials",
};
// Color-relevant and animation chunks stay; they change how pixels render.
// (acTL/fcTL/fdAT = APNG frames, cICP/mDCv/cLLi = HDR colorimetry — dropping
// them would silently flatten animation or shift colors.)
const PNG_KEEP_ANCILLARY = new Set([
  "PLTE", "gAMA", "cHRM", "sRGB", "iCCP", "bKGD", "tRNS", "pHYs", "sBIT", "hIST",
  "acTL", "fcTL", "fdAT", "cICP", "mDCv", "cLLi",
]);

function pngChunks(view: DataView): { type: string; start: number; length: number }[] {
  const chunks: { type: string; start: number; length: number }[] = [];
  if (view.byteLength < 8 || view.getUint32(0) !== 0x89504e47) return chunks;
  let offset = 8;
  while (offset + 12 <= view.byteLength) {
    const size = view.getUint32(offset);
    const type = ascii(view, offset + 4, 4);
    chunks.push({ type, start: offset, length: 12 + size });
    offset += 12 + size;
    if (type === "IEND") break;
  }
  return chunks;
}

export function scanPngStructure(buffer: ArrayBuffer): { blocks: MetadataBlock[]; hasC2pa: boolean } {
  const view = new DataView(buffer);
  const found = new Set<MetadataBlock>();
  let hasC2pa = false;
  for (const chunk of pngChunks(view)) {
    const block = PNG_DROP_CHUNKS[chunk.type];
    if (block) {
      found.add(block);
      if (chunk.type === "caBX") hasC2pa = true;
    }
  }
  return { blocks: [...found], hasC2pa };
}

/** Removes metadata chunks from a PNG without re-encoding the pixel data. */
export function stripPngMetadata(buffer: ArrayBuffer): StripResult {
  const view = new DataView(buffer);
  const chunks = pngChunks(view);
  if (!chunks.length) throw new Error("Not a PNG file.");
  const source = new Uint8Array(buffer);
  const kept: Uint8Array[] = [source.subarray(0, 8)];
  const removed = new Set<MetadataBlock>();
  for (const chunk of chunks) {
    const block = PNG_DROP_CHUNKS[chunk.type];
    const critical = chunk.type === "IHDR" || chunk.type === "IDAT" || chunk.type === "IEND";
    if (block) {
      removed.add(block);
      continue;
    }
    if (critical || PNG_KEEP_ANCILLARY.has(chunk.type)) {
      kept.push(source.subarray(chunk.start, chunk.start + chunk.length));
    }
    // Unknown ancillary chunks are dropped: safer for privacy than guessing.
  }
  const total = kept.reduce((n, part) => n + part.length, 0);
  const out = new Uint8Array(total);
  let at = 0;
  for (const part of kept) {
    out.set(part, at);
    at += part.length;
  }
  return { data: out, removed: [...removed], lossless: true };
}

/* ------------------------------------------------------------------ */
/* WebP (RIFF)                                                         */
/* ------------------------------------------------------------------ */

function webpChunks(view: DataView): { type: string; start: number; length: number }[] {
  const chunks: { type: string; start: number; length: number }[] = [];
  if (
    view.byteLength < 12 ||
    ascii(view, 0, 4) !== "RIFF" ||
    ascii(view, 8, 4) !== "WEBP"
  ) {
    return chunks;
  }
  let offset = 12;
  while (offset + 8 <= view.byteLength) {
    const size = view.getUint32(offset + 4, true);
    const type = ascii(view, offset, 4);
    chunks.push({ type, start: offset, length: 8 + size + (size % 2) }); // chunks are 2-byte aligned
    offset += 8 + size + (size % 2);
  }
  return chunks;
}

export function scanWebpStructure(buffer: ArrayBuffer): { blocks: MetadataBlock[]; hasC2pa: boolean } {
  const view = new DataView(buffer);
  const found = new Set<MetadataBlock>();
  let hasC2pa = false;
  for (const chunk of webpChunks(view)) {
    if (chunk.type === "EXIF") found.add("EXIF");
    else if (chunk.type === "XMP ") found.add("XMP");
    else if (chunk.type === "ICCP") found.add("ICC profile");
    else if (chunk.type === "C2PA") {
      found.add("C2PA credentials");
      hasC2pa = true;
    }
  }
  return { blocks: [...found], hasC2pa };
}

/** Removes EXIF/XMP/C2PA chunks from a WebP file; pixel chunks stay verbatim. */
export function stripWebpMetadata(buffer: ArrayBuffer): StripResult {
  const view = new DataView(buffer);
  const chunks = webpChunks(view);
  if (!chunks.length) throw new Error("Not a WebP file.");
  const source = new Uint8Array(buffer);
  const removed = new Set<MetadataBlock>();
  const kept: Uint8Array[] = [];
  for (const chunk of chunks) {
    if (chunk.type === "EXIF") {
      removed.add("EXIF");
      continue;
    }
    if (chunk.type === "XMP ") {
      removed.add("XMP");
      continue;
    }
    if (chunk.type === "C2PA") {
      removed.add("C2PA credentials");
      continue;
    }
    let slice = source.subarray(chunk.start, chunk.start + chunk.length);
    if (chunk.type === "VP8X") {
      // Clear the EXIF (0x08) and XMP (0x04) feature flags so readers don't
      // look for chunks we just dropped. Flags byte is the first payload byte.
      const copy = slice.slice();
      copy[8] = copy[8] & ~0x0c;
      slice = copy;
    }
    kept.push(slice);
  }
  const payloadSize = kept.reduce((n, part) => n + part.length, 0);
  const out = new Uint8Array(12 + payloadSize);
  out.set(source.subarray(0, 12), 0); // RIFF header, size patched below
  new DataView(out.buffer).setUint32(4, 4 + payloadSize, true);
  let at = 12;
  for (const part of kept) {
    out.set(part, at);
    at += part.length;
  }
  return { data: out, removed: [...removed], lossless: true };
}

/* ------------------------------------------------------------------ */
/* Container dispatch + exifr enrichment                               */
/* ------------------------------------------------------------------ */

export function detectContainer(buffer: ArrayBuffer): ScanReport["container"] {
  const view = new DataView(buffer);
  if (view.byteLength >= 4 && view.getUint16(0) === 0xffd8) return "jpeg";
  if (view.byteLength >= 8 && view.getUint32(0) === 0x89504e47) return "png";
  if (view.byteLength >= 12 && ascii(view, 0, 4) === "RIFF" && ascii(view, 8, 4) === "WEBP") return "webp";
  return "other";
}

/** Strips metadata losslessly where the container allows it. */
export function stripMetadataLossless(buffer: ArrayBuffer): StripResult {
  const container = detectContainer(buffer);
  if (container === "jpeg") return stripJpegMetadata(buffer);
  if (container === "png") return stripPngMetadata(buffer);
  if (container === "webp") return stripWebpMetadata(buffer);
  throw new Error("Unsupported image format.");
}

/** Generators whose fingerprints show up in EXIF/XMP/PNG-text values. */
const AI_FINGERPRINTS: [RegExp, string][] = [
  [/midjourney/i, "Midjourney"],
  [/dall[-·\s]?e/i, "DALL·E"],
  [/stable[\s-]?diffusion|stability\.ai|stable-?diffusion/i, "Stable Diffusion"],
  [/adobe\s?firefly/i, "Adobe Firefly"],
  [/novelai/i, "NovelAI"],
  [/comfyui/i, "ComfyUI"],
  [/ideogram/i, "Ideogram"],
  [/leonardo\.ai|leonardo ai/i, "Leonardo AI"],
  [/gemini|nano[-\s]?banana|imagen/i, "Google Gemini / Imagen"],
  [/doubao|jimeng/i, "Doubao / Jimeng"],
  [/qwen/i, "Qwen"],
  [/bing image creator|microsoft designer/i, "Microsoft Designer"],
  [/flux/i, "FLUX"],
  [/recraft/i, "Recraft"],
  [/playground ai|playground\.com/i, "Playground AI"],
];

const INTERESTING_KEYS: [string, string][] = [
  ["Make", "Camera make"],
  ["Model", "Camera model"],
  ["Software", "Software"],
  ["CreatorTool", "Creator tool"],
  ["DateTimeOriginal", "Taken"],
  ["CreateDate", "Created"],
  ["ImageDescription", "Description"],
  ["UserComment", "Embedded comment"],
  ["prompt", "Prompt"],
  ["parameters", "Generation parameters"],
];

/**
 * Full local scan: container structure (EXIF/XMP/C2PA presence) plus a parsed
 * field read via exifr. Runs entirely in the page; the file never leaves it.
 * Pass an already-read `buffer` to avoid reading the file twice.
 */
export async function scanImageMetadata(file: File, presetBuffer?: ArrayBuffer): Promise<ScanReport> {
  const buffer = presetBuffer ?? (await file.arrayBuffer());
  const container = detectContainer(buffer);
  const structural =
    container === "jpeg"
      ? scanJpegStructure(buffer)
      : container === "png"
        ? scanPngStructure(buffer)
        : container === "webp"
          ? scanWebpStructure(buffer)
          : { blocks: [], hasC2pa: false };

  let parsed: Record<string, unknown> = {};
  let orientation: number | null = null;
  try {
    const exifr = await import("exifr");
    parsed = (await exifr.parse(file, {
      xmp: true,
      iptc: true,
      icc: false,
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
    })) ?? {};
    const raw = await exifr.orientation(file).catch(() => undefined);
    if (typeof raw === "number") orientation = raw;
  } catch {
    // Parsing is best-effort; the structural scan above still stands.
  }

  const blocks = new Set<MetadataBlock>(structural.blocks);
  if (parsed && Object.keys(parsed).length && !blocks.has("EXIF") && container === "other") {
    blocks.add("EXIF");
  }

  const fields: { label: string; value: string }[] = [];
  const aiSignals = new Set<string>();
  for (const [key, label] of INTERESTING_KEYS) {
    const value = parsed[key];
    if (value == null) continue;
    const text =
      value instanceof Date
        ? value.toLocaleString()
        : typeof value === "object"
          ? JSON.stringify(value).slice(0, 200)
          : String(value).slice(0, 200);
    if (text.trim()) fields.push({ label, value: text });
  }
  // Hunt AI fingerprints across every string the parser recovered.
  const haystack = Object.values(parsed)
    .map((v) => (typeof v === "string" ? v : v instanceof Date ? "" : JSON.stringify(v) ?? ""))
    .join("\n");
  for (const [pattern, name] of AI_FINGERPRINTS) {
    if (pattern.test(haystack)) aiSignals.add(name);
  }
  // PNG text chunks with generation parameters may not parse via exifr — scan raw.
  if (container === "png") {
    const rawText = textDecoder.decode(new Uint8Array(buffer).subarray(0, Math.min(buffer.byteLength, 2_000_000)));
    for (const [pattern, name] of AI_FINGERPRINTS) {
      if (pattern.test(rawText)) aiSignals.add(name);
    }
    if (/parameters|prompt/i.test(rawText)) blocks.add("Text data");
  }

  const gps = parsed["gps"] as { latitude?: number; longitude?: number } | undefined;
  const hasGps = Boolean(
    gps && typeof gps.latitude === "number" && typeof gps.longitude === "number",
  );

  return {
    container,
    blocks: [...blocks],
    hasGps,
    orientation,
    aiSignals: [...aiSignals],
    fields,
  };
}
