import assert from "node:assert/strict";
import test from "node:test";
import {
  detectContainer,
  stripJpegMetadata,
  stripPngMetadata,
  stripWebpMetadata,
  scanJpegStructure,
} from "../src/lib/image-metadata";
import { decodeCbor } from "../src/lib/cbor";
import { readC2pa, extractJpegApp11Payload } from "../src/lib/c2pa";

/* ---- tiny fixture builders ---- */

function seg(marker: number, payload: number[]): number[] {
  const len = payload.length + 2;
  return [0xff, marker, (len >> 8) & 0xff, len & 0xff, ...payload];
}

function makeJpeg(extraSegments: number[][] = []): Uint8Array {
  const soi = [0xff, 0xd8];
  const app0 = seg(0xe0, [0x4a, 0x46, 0x49, 0x46, 0x00]); // "JFIF\0"
  const sos = [0xff, 0xda, 0x00, 0x02, 0x00, 0x11, 0x22, 0x33, 0xff, 0xd9];
  return new Uint8Array([...soi, ...app0, ...extraSegments.flat(), ...sos]);
}

function box(type: string, payload: number[]): number[] {
  const len = payload.length + 8;
  const typeBytes = [...type].map((c) => c.charCodeAt(0));
  return [(len >> 24) & 0xff, (len >> 16) & 0xff, (len >> 8) & 0xff, len & 0xff, ...typeBytes, ...payload];
}

function cborText(s: string): number[] {
  const bytes = [...Buffer.from(s, "utf8")];
  return [0x60 + bytes.length, ...bytes];
}

const CLAIM_CBOR = [
  0xa1, // map(1)
  ...cborText("claim_generator"),
  ...cborText("TestApp/1.0"),
];

function makeManifestStore(): number[] {
  const jumdClaim = box("jumd", [
    ...[..."cbor"].map((c) => c.charCodeAt(0)),
    ...[..."c2pa.claim"].map((c) => c.charCodeAt(0)),
    0x00,
  ]);
  const claimContent = box("cbor", CLAIM_CBOR);
  const jumdStore = box("jumd", [
    ...[..."jumb"].map((c) => c.charCodeAt(0)),
    ...[..."c2pa"].map((c) => c.charCodeAt(0)),
    0x00,
  ]);
  const claimSuper = box("jumb", [...jumdClaim, ...claimContent]);
  return box("jumb", [...jumdStore, ...claimSuper]);
}

function app11C2pa(manifest: number[]): number[] {
  return seg(0xeb, [0x4a, 0x50, 0x00, 0x00, 0x00, 0x01, ...manifest]);
}

/* ---- container detection ---- */

test("detectContainer recognizes jpeg, png, webp", () => {
  assert.equal(detectContainer(makeJpeg().buffer as ArrayBuffer), "jpeg");
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
  assert.equal(detectContainer(png.buffer as ArrayBuffer), "png");
  const webp = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
  assert.equal(detectContainer(webp.buffer as ArrayBuffer), "webp");
});

/* ---- JPEG strip ---- */

test("stripJpegMetadata drops EXIF/XMP/C2PA/COM but keeps APP0 and scan data", () => {
  const exif = seg(0xe1, [0x45, 0x78, 0x69, 0x66, 0x00, 0x00, 1, 2, 3]); // "Exif\0\0"
  const xmp = seg(0xe1, [0x68, 0x74, 0x74, 0x70, 0x3a]); // "http:"
  const comment = seg(0xfe, [0x68, 0x69]);
  const icc = seg(0xe2, [0x49, 0x43, 0x43, 0x5f, 1, 2]); // "ICC_"
  const jpeg = makeJpeg([exif, xmp, comment, icc, app11C2pa(makeManifestStore())]);

  const structure = scanJpegStructure(jpeg.buffer as ArrayBuffer);
  assert.ok(structure.blocks.includes("EXIF"));
  assert.ok(structure.blocks.includes("C2PA credentials"));
  assert.ok(structure.hasC2pa);

  const { data, removed } = stripJpegMetadata(jpeg.buffer as ArrayBuffer);
  assert.ok(removed.includes("EXIF"));
  assert.ok(removed.includes("XMP"));
  assert.ok(removed.includes("Comment"));
  assert.ok(removed.includes("C2PA credentials"));

  const after = scanJpegStructure(data.buffer as ArrayBuffer);
  assert.deepEqual(after.blocks, ["ICC profile"]); // color data intentionally kept
  assert.equal(after.hasC2pa, false);
  // APP0 (JFIF) survives, ICC survives, SOI/SOS structure intact.
  assert.equal(data[0], 0xff);
  assert.equal(data[1], 0xd8);
  const hex = [...data].map((b) => b.toString(16).padStart(2, "0")).join("");
  assert.ok(hex.includes("ffd8ffe0")); // SOI then APP0
  assert.ok(hex.includes("4943435f")); // "ICC_" kept
  assert.ok(hex.endsWith("ffd9"));
});

/* ---- PNG strip ---- */

function pngChunk(type: string, payload: number[]): number[] {
  const typeBytes = [...type].map((c) => c.charCodeAt(0));
  const len = payload.length;
  return [(len >> 24) & 0xff, (len >> 16) & 0xff, (len >> 8) & 0xff, len & 0xff, ...typeBytes, ...payload, 0, 0, 0, 0];
}

test("stripPngMetadata drops text chunks, keeps pixel chunks", () => {
  const png = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ...pngChunk("IHDR", new Array(13).fill(0)),
    ...pngChunk("tEXt", [0x61, 0x62, 0x63]),
    ...pngChunk("eXIf", [1, 2, 3]),
    ...pngChunk("IDAT", [9, 9, 9]),
    ...pngChunk("IEND", []),
  ]);
  const { data, removed } = stripPngMetadata(png.buffer as ArrayBuffer);
  assert.ok(removed.includes("Text data"));
  assert.ok(removed.includes("EXIF"));
  const types: string[] = [];
  let offset = 8;
  const view = new DataView(data.buffer);
  while (offset + 12 <= data.byteLength) {
    const size = view.getUint32(offset);
    types.push(String.fromCharCode(data[offset + 4], data[offset + 5], data[offset + 6], data[offset + 7]));
    offset += 12 + size;
  }
  assert.deepEqual(types, ["IHDR", "IDAT", "IEND"]);
});

/* ---- WebP strip ---- */

function webpChunk(type: string, payload: number[]): number[] {
  const typeBytes = [...type].map((c) => c.charCodeAt(0));
  const len = payload.length;
  const head = [...typeBytes, len & 0xff, (len >> 8) & 0xff, (len >> 16) & 0xff, (len >> 24) & 0xff];
  return [...head, ...payload, ...(len % 2 ? [0] : [])];
}

test("stripWebpMetadata drops EXIF/XMP and clears VP8X flags", () => {
  const vp8x = webpChunk("VP8X", [0x0c, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // EXIF+XMP flags set
  const payload = [...webpChunk("VP8 ", [1, 2, 3, 4]), ...webpChunk("EXIF", [5, 6, 7, 8])];
  const riffSize = 4 + vp8x.length + payload.length;
  const webp = new Uint8Array([
    0x52, 0x49, 0x46, 0x46,
    riffSize & 0xff, (riffSize >> 8) & 0xff, 0, 0,
    0x57, 0x45, 0x42, 0x50,
    ...vp8x,
    ...payload,
  ]);
  const { data, removed } = stripWebpMetadata(webp.buffer as ArrayBuffer);
  assert.ok(removed.includes("EXIF"));
  const text = [...data].map((b) => String.fromCharCode(b)).join("");
  assert.ok(!text.includes("EXIF"));
  assert.ok(text.includes("VP8X"));
  // VP8X flags byte (chunk data starts at offset 20 + 8) has EXIF/XMP bits cleared.
  const vp8xIndex = text.indexOf("VP8X");
  assert.equal(data[vp8xIndex + 8] & 0x0c, 0);
});

/* ---- CBOR ---- */

test("decodeCbor reads maps, strings, numbers, arrays, tags", () => {
  const claim = decodeCbor(new Uint8Array(CLAIM_CBOR));
  assert.deepEqual(claim, { claim_generator: "TestApp/1.0" });

  // tag(55799) wrapping array [1, "two", -3]
  const tagged = new Uint8Array([0xd9, 0xd9, 0xf7, 0x83, 0x01, 0x63, 0x74, 0x77, 0x6f, 0x22]);
  assert.deepEqual(decodeCbor(tagged), [1, "two", -3]);
});

/* ---- C2PA end-to-end on a synthetic JPEG ---- */

test("readC2pa finds and parses the claim in a JPEG APP11 manifest", () => {
  const jpeg = makeJpeg([app11C2pa(makeManifestStore())]);
  const buffer = jpeg.buffer as ArrayBuffer;
  const payload = extractJpegApp11Payload(buffer);
  assert.ok(payload, "APP11 payload should be found");
  const report = readC2pa(buffer, "jpeg");
  assert.equal(report.found, true);
  assert.equal(report.claimGenerator, "TestApp/1.0");
  assert.equal(report.partial, false);
});

test("readC2pa reports not-found on a clean JPEG", () => {
  const jpeg = makeJpeg();
  const report = readC2pa(jpeg.buffer as ArrayBuffer, "jpeg");
  assert.equal(report.found, false);
});

/* ---- regression tests from adversarial review ---- */

import { readFileSync } from "node:fs";

// Real manifest produced by c2pa-rs 0.33.1 (Apache-2.0/MIT test fixture from
// github.com/contentauth/c2pa-rs). Guards the UUID-style JUMD label layout
// (16-byte UUID + flag byte) that offset-guessing once misparsed.
test("readC2pa parses a real c2pa-rs manifest (C.jpg fixture)", () => {
  const buf = readFileSync(new URL("./fixtures/c2pa-sample.jpg", import.meta.url));
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  const report = readC2pa(ab, "jpeg");
  assert.equal(report.found, true);
  assert.equal(report.partial, false);
  assert.match(report.claimGenerator ?? "", /c2pa-rs/);
  assert.ok(report.actions.includes("Created"));
  assert.equal(report.signaturePresent, true);
  assert.ok(report.assertionLabels.some((l) => l.includes("c2pa.claim")));
});

test("stripPngMetadata preserves APNG and HDR color chunks", () => {
  const png = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ...pngChunk("IHDR", new Array(13).fill(0)),
    ...pngChunk("acTL", [0, 0, 0, 2, 0, 0, 0, 0]),
    ...pngChunk("cICP", [9, 16, 0, 1]),
    ...pngChunk("tEXt", [0x61, 0x62, 0x63]),
    ...pngChunk("fcTL", new Array(26).fill(0)),
    ...pngChunk("IDAT", [9, 9, 9]),
    ...pngChunk("fdAT", [0, 0, 0, 1, 7, 7]),
    ...pngChunk("IEND", []),
  ]);
  const { data } = stripPngMetadata(png.buffer as ArrayBuffer);
  const types: string[] = [];
  let offset = 8;
  const view = new DataView(data.buffer);
  while (offset + 12 <= data.byteLength) {
    const size = view.getUint32(offset);
    types.push(String.fromCharCode(data[offset + 4], data[offset + 5], data[offset + 6], data[offset + 7]));
    offset += 12 + size;
  }
  assert.deepEqual(types, ["IHDR", "acTL", "cICP", "fcTL", "IDAT", "fdAT", "IEND"]);
});

test("JPEG scan and strip tolerate truncated segments without throwing", () => {
  // APP1 declares a payload but the file ends right after the header.
  const truncated = new Uint8Array([0xff, 0xd8, 0xff, 0xe1, 0x00, 0x20, 0x45]);
  assert.doesNotThrow(() => scanJpegStructure(truncated.buffer as ArrayBuffer));
  assert.doesNotThrow(() => stripJpegMetadata(truncated.buffer as ArrayBuffer));
});

test("decodeCbor rejects pathological nesting", () => {
  // 500 nested arrays: 0x81 repeated.
  const bomb = new Uint8Array(501).fill(0x81);
  bomb[500] = 0x00;
  assert.throws(() => decodeCbor(bomb), /too deep/);
});
