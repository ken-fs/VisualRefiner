import assert from "node:assert/strict";
import test from "node:test";
import { formatBytes, outputName } from "../src/lib/tools";

test("outputName removes the old extension and unsafe spacing", () => {
  assert.equal(outputName("Summer photo.JPG", "converted", "webp"), "Summer-photo-converted.webp");
});

test("formatBytes uses readable binary units", () => {
  assert.equal(formatBytes(800), "800 B");
  assert.equal(formatBytes(2048), "2.0 KB");
  assert.equal(formatBytes(2 * 1024 * 1024), "2.0 MB");
});
