/**
 * Best-effort C2PA (Content Credentials) reader.
 *
 * Locates the JUMBF manifest store inside JPEG (APP11 "JP" segments), PNG
 * (caBX chunk), or WebP (C2PA chunk), walks the box tree, and CBOR-decodes
 * the claim plus a few well-known assertions. It deliberately does NOT verify
 * the cryptographic signature — the report says "credentials embedded" rather
 * than "credentials verified". Verification needs the full C2PA toolchain;
 * presence plus claim details is what this page promises.
 */

import { decodeCbor, type CborValue } from "./cbor";

export type C2paReport = {
  found: boolean;
  claimGenerator?: string;
  title?: string;
  format?: string;
  actions: string[];
  digitalSourceTypes: string[];
  signaturePresent: boolean;
  assertionLabels: string[];
  /** Human note when details could not be read from a present manifest. */
  partial: boolean;
};

type Box = { type: string; start: number; size: number; header: number };

const decoder = new TextDecoder();

function walkBoxes(
  view: DataView,
  from: number,
  to: number,
  visit: (box: Box) => void,
) {
  let offset = from;
  while (offset + 8 <= to) {
    let size = view.getUint32(offset);
    let header = 8;
    if (size === 1) {
      if (offset + 16 > to) return;
      size = Number(view.getBigUint64(offset + 8));
      header = 16;
    } else if (size === 0) {
      size = to - offset; // box runs to end of container
    }
    if (size < header || offset + size > to) return;
    const type = String.fromCharCode(
      view.getUint8(offset + 4),
      view.getUint8(offset + 5),
      view.getUint8(offset + 6),
      view.getUint8(offset + 7),
    );
    visit({ type, start: offset, size, header });
    offset += size;
  }
}

/**
 * Reads a jumd description box label. Writers disagree on the prefix layout:
 * current c2pa-rs uses a 16-byte UUID + 1 flag byte before the label (so the
 * label starts at offset 17), while earlier drafts used a 4-byte content
 * type. Probe the plausible offsets and prefer labels with a C2PA-ish prefix.
 */
function readJumdLabel(view: DataView, box: Box): string {
  const start = box.start + box.header;
  const end = box.start + box.size;
  const candidates: string[] = [];
  for (const typeLen of [17, 16, 4, 5, 20, 21]) {
    const labelStart = start + typeLen;
    if (labelStart >= end) continue;
    let nul = labelStart;
    while (nul < end && view.getUint8(nul) !== 0) nul++;
    const label = decoder.decode(
      new Uint8Array(view.buffer, view.byteOffset + labelStart, nul - labelStart),
    );
    if (/^[\x20-\x7e]{2,}$/.test(label)) candidates.push(label);
  }
  return (
    candidates.find((l) => /^(c2pa|stds|org\.|com\.|adobe|iptc|exif|dc)[.\/:-]/i.test(l)) ??
    candidates[0] ??
    ""
  );
}

/** Collects (label, cborPayload) pairs from a JUMBF manifest store buffer. */
function collectCborPayloads(bytes: Uint8Array): { label: string; payload: Uint8Array }[] {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const out: { label: string; payload: Uint8Array }[] = [];

  const walkSuperbox = (from: number, to: number, depth: number) => {
    if (depth > 6) return;
    walkBoxes(view, from, to, (box) => {
      if (box.type !== "jumb") return;
      // A superbox: first child should be its jumd description.
      let label = "";
      const contentFrom = box.start + box.header;
      const contentTo = box.start + box.size;
      walkBoxes(view, contentFrom, contentTo, (child) => {
        if (child.type === "jumd" && !label) label = readJumdLabel(view, child);
      });
      walkBoxes(view, contentFrom, contentTo, (child) => {
        if (child.type === "cbor") {
          const payloadStart = child.start + child.header;
          out.push({
            label,
            payload: bytes.subarray(payloadStart, child.start + child.size),
          });
        } else if (child.type === "jumb") {
          walkSuperbox(child.start, child.start + child.size, depth + 1);
        }
      });
    });
  };

  // The buffer may be the manifest store itself (starts with 'jumb') or raw
  // box data; search a shallow window for the first jumb box either way.
  walkSuperbox(0, bytes.byteLength, 0);
  if (!out.length) {
    const sig = [0x6a, 0x75, 0x6d, 0x62]; // "jumb"
    for (let i = 0; i + 4 <= bytes.byteLength; i++) {
      if (
        bytes[i] === sig[0] &&
        bytes[i + 1] === sig[1] &&
        bytes[i + 2] === sig[2] &&
        bytes[i + 3] === sig[3]
      ) {
        walkSuperbox(i - 4, bytes.byteLength, 0); // i-4 = LBox start
        break;
      }
    }
  }
  return out;
}

/**
 * Reassembles a JPEG's APP11 JUMBF segments (ISO 19566-5 fragmentation).
 * After the "JP" identifier each segment carries a small envelope header —
 * 4 bytes in current C2PA writers, but older drafts and exotic writers vary,
 * so `skip` is configurable and the caller retries a few candidate lengths.
 */
export function extractJpegApp11Payload(buffer: ArrayBuffer, skip = 4): Uint8Array | null {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null;
  const parts: Uint8Array[] = [];
  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint8(offset + 1);
    if (marker === 0xda) break;
    const size = view.getUint16(offset + 2);
    const payloadStart = offset + 4;
    if (marker === 0xeb && view.getUint16(payloadStart) === 0x4a50) {
      parts.push(
        new Uint8Array(buffer).subarray(payloadStart + 2 + skip, payloadStart + 2 + size),
      );
    }
    offset += 2 + size;
  }
  if (!parts.length) return null;
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

/** Extracts the manifest store bytes from PNG caBX or WebP C2PA chunks. */
export function extractContainerC2pa(buffer: ArrayBuffer, fourcc: string): Uint8Array | null {
  const view = new DataView(buffer);
  // PNG
  if (view.byteLength >= 8 && view.getUint32(0) === 0x89504e47) {
    let offset = 8;
    while (offset + 12 <= view.byteLength) {
      const size = view.getUint32(offset);
      const type = String.fromCharCode(
        view.getUint8(offset + 4),
        view.getUint8(offset + 5),
        view.getUint8(offset + 6),
        view.getUint8(offset + 7),
      );
      if (type === fourcc) {
        return new Uint8Array(buffer).subarray(offset + 8, offset + 8 + size);
      }
      offset += 12 + size;
      if (type === "IEND") break;
    }
    return null;
  }
  // WebP / RIFF
  if (
    view.byteLength >= 12 &&
    String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)) === "RIFF"
  ) {
    let offset = 12;
    while (offset + 8 <= view.byteLength) {
      const size = view.getUint32(offset + 4, true);
      const type = String.fromCharCode(
        view.getUint8(offset),
        view.getUint8(offset + 1),
        view.getUint8(offset + 2),
        view.getUint8(offset + 3),
      );
      if (type === fourcc) {
        return new Uint8Array(buffer).subarray(offset + 8, offset + 8 + size);
      }
      offset += 8 + size + (size % 2);
    }
  }
  return null;
}

function asString(value: CborValue | undefined): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function flattenStrings(value: CborValue, into: string[]) {
  if (typeof value === "string") into.push(value);
  else if (Array.isArray(value)) value.forEach((v) => flattenStrings(v, into));
  else if (value && typeof value === "object" && !(value instanceof Uint8Array)) {
    Object.values(value).forEach((v) => flattenStrings(v, into));
  }
}

const KNOWN_ACTIONS: Record<string, string> = {
  "c2pa.created": "Created",
  "c2pa.opened": "Opened",
  "c2pa.placed": "Placed into a composition",
  "c2pa.edited": "Edited",
  "c2pa.resized": "Resized",
  "c2pa.cropped": "Cropped",
  "c2pa.filtered": "Filtered",
  "c2pa.color_adjustments": "Color adjusted",
  "c2pa.converted": "Format converted",
  "c2pa.repackaged": "Repackaged",
  "c2pa.published": "Published",
  "c2pa.redacted": "Redacted",
  "c2pa.deleted": "Deleted",
  "c2pa.unknown": "Unknown change",
};

const SOURCE_TYPE_LABELS: [RegExp, string][] = [
  [/trainedAlgorithmicMedia/i, "AI-generated (trained model output)"],
  [/compositeWithTrainedAlgorithmicMedia/i, "Composite including AI-generated media"],
  [/algorithmicMedia/i, "Algorithmically generated media"],
  [/softwareImage/i, "Made by software (not a camera)"],
  [/digitalCapture/i, "Digital camera capture"],
  [/negativeFilm|positiveFilm|print/i, "Digitized from film or print"],
];

export function parseC2paManifest(bytes: Uint8Array): C2paReport {
  const report: C2paReport = {
    found: true,
    actions: [],
    digitalSourceTypes: [],
    signaturePresent: false,
    assertionLabels: [],
    partial: true,
  };
  const payloads = collectCborPayloads(bytes);
  if (!payloads.length) return report;

  const sourceTypes = new Set<string>();
  const actions = new Set<string>();
  const allStrings: string[] = [];

  for (const { label, payload } of payloads) {
    if (label.includes("c2pa.signature")) {
      report.signaturePresent = true;
      continue;
    }
    let decoded: CborValue;
    try {
      decoded = decodeCbor(payload);
    } catch {
      continue;
    }
    report.partial = false;
    if (label) report.assertionLabels.push(label);
    flattenStrings(decoded, allStrings);

    // COSE signatures decode to an array (tagged COSE_Sign1); claims and
    // assertions decode to maps. Classify by content first — labels are a
    // nice-to-have, not a requirement.
    if (Array.isArray(decoded)) {
      report.signaturePresent = true;
      continue;
    }
    if (!decoded || typeof decoded !== "object") continue;
    const map = decoded as Record<string, CborValue>;
    if (label.includes("c2pa.signature")) report.signaturePresent = true;

    if ("claim_generator" in map || label.includes("c2pa.claim")) {
      report.claimGenerator = asString(map["claim_generator"]) ?? report.claimGenerator;
      report.title = asString(map["title"]) ?? report.title;
      report.format = asString(map["format"]) ?? report.format;
      if (map["signature"] !== undefined) report.signaturePresent = true;
    }
    const actionsData = map["actions"];
    if (Array.isArray(actionsData)) {
      for (const entry of actionsData) {
        if (entry && typeof entry === "object" && !Array.isArray(entry)) {
          const action = asString((entry as Record<string, CborValue>)["action"]);
          if (action) actions.add(KNOWN_ACTIONS[action] ?? action);
        }
      }
    }
  }

  // digitalSourceType can hide in actions or ingredient assertions — scan all
  // decoded strings for the IPTC vocabulary values.
  for (const text of allStrings) {
    for (const [pattern, labelText] of SOURCE_TYPE_LABELS) {
      if (pattern.test(text)) sourceTypes.add(labelText);
    }
  }

  report.actions = [...actions];
  report.digitalSourceTypes = [...sourceTypes];
  return report;
}

/** Top-level: find and parse the manifest store from an image file buffer. */
export function readC2pa(buffer: ArrayBuffer, container: "jpeg" | "png" | "webp" | "other"): C2paReport {
  const empty: C2paReport = {
    found: false,
    actions: [],
    digitalSourceTypes: [],
    signaturePresent: false,
    assertionLabels: [],
    partial: false,
  };
  let candidates: (Uint8Array | null)[] = [];
  if (container === "jpeg") {
    // Real-world envelope headers seen so far are 4 and 6 bytes; probe more.
    candidates = [6, 4, 0, 2, 8].map((skip) => extractJpegApp11Payload(buffer, skip));
  } else if (container === "png") {
    candidates = [extractContainerC2pa(buffer, "caBX")];
  } else if (container === "webp") {
    candidates = [extractContainerC2pa(buffer, "C2PA")];
  }
  let sawManifest = false;
  for (const manifest of candidates) {
    if (!manifest) continue;
    sawManifest = true;
    try {
      const report = parseC2paManifest(manifest);
      if (!report.partial) return report;
    } catch {
      // Try the next candidate layout.
    }
  }
  return sawManifest ? { ...empty, found: true, partial: true } : empty;
}
