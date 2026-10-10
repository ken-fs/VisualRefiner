import assert from "node:assert/strict";
import test from "node:test";
import { STYLE_DEFAULTS, finalizeSvg, preparePixels, svgStats, traceSize, vtracerConfig } from "../src/lib/vectorize";

test("vtracerConfig converts CLI-style settings to visioncortex units", () => {
  const config = vtracerConfig(STYLE_DEFAULTS.logo);
  assert.equal(config.binary, false);
  assert.equal(config.filterSpeckle, 16); // 4px per side → area
  assert.equal(config.colorPrecision, 2); // keep 6 bits → drop 2
  assert.ok(Math.abs(config.cornerThreshold - Math.PI / 3) < 1e-9);
  assert.equal(vtracerConfig(STYLE_DEFAULTS.bw).binary, true);
  assert.equal(vtracerConfig(STYLE_DEFAULTS.photo).layerDifference, 48);
});

test("traceSize caps large images and leaves small ones alone", () => {
  assert.deepEqual(traceSize(4000, 3000), { width: 2000, height: 1500 });
  assert.deepEqual(traceSize(48, 48), { width: 48, height: 48 });
  assert.deepEqual(traceSize(1200, 800), { width: 1200, height: 800 });
});

test("preparePixels thresholds black and white on luminance and alpha", () => {
  const rgba = new Uint8ClampedArray([10, 10, 10, 255, 250, 250, 250, 255, 10, 10, 10, 0]);
  const out = preparePixels(rgba, { ...STYLE_DEFAULTS.bw, threshold: 128 });
  assert.deepEqual([...out], [0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255]);
  const inverted = preparePixels(rgba, { ...STYLE_DEFAULTS.bw, invert: true });
  assert.deepEqual([...inverted.slice(0, 4)], [255, 255, 255, 255]);
});

test("preparePixels drops white and snaps soft alpha in color mode", () => {
  const rgba = new Uint8ClampedArray([250, 250, 250, 255, 200, 0, 0, 90, 200, 0, 0, 200]);
  const out = preparePixels(rgba, { ...STYLE_DEFAULTS.logo, dropWhite: true });
  assert.equal(out[3], 0);
  assert.equal(out[7], 0);
  assert.equal(out[11], 255);
});

test("finalizeSvg adds a viewBox and restores the source dimensions", () => {
  const raw = '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generator: visioncortex VTracer 0.1.0 -->\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="600" height="300">\n<path d="M0 0 Z" fill="#DC1E1E"/>\n<path d="M1 1 Z" fill="#dc1e1e"/>\n</svg>';
  const svg = finalizeSvg(raw, { width: 600, height: 300 }, { width: 120, height: 60 });
  assert.match(svg, /width="120" height="60" viewBox="0 0 600 300"/);
  assert.doesNotMatch(svg, /Generator/);
  assert.deepEqual(svgStats(svg), { paths: 2, colors: 1 });
});
