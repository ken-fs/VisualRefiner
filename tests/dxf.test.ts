import assert from "node:assert/strict";
import test from "node:test";
import { arcToCubics, flattenSubpaths, nearestAci, parsePathData, shapePathData, writeDxf } from "../src/lib/dxf";

test("parsePathData resolves relative, implicit and shorthand commands", () => {
  const [sub] = parsePathData("m10 10 20 0 v20 h-20 z");
  assert.deepEqual(sub.start, [10, 10]);
  assert.deepEqual(sub.segments.map((s) => s.to), [[30, 10], [30, 30], [10, 30]]);
  assert.equal(sub.closed, true);

  const [curve] = parsePathData("M0 0C10 0 10 10 20 10S30 20 40 20");
  const second = curve.segments[1];
  assert.equal(second.kind, "cubic");
  if (second.kind === "cubic") assert.deepEqual(second.c1, [30, 10]); // (10,10) reflected through (20,10)
});

test("parsePathData starts a new subpath after Z and reads compact arc flags", () => {
  const subpaths = parsePathData("M0 0L10 0L10 10ZL0 10M50 50a5 5 0 105 5");
  assert.equal(subpaths.length, 3);
  assert.deepEqual(subpaths[1].start, [0, 0]); // lineto after Z begins at the old start
  const arc = subpaths[2].segments.at(-1);
  assert.deepEqual(arc?.to, [55, 55]);
});

test("arcToCubics follows a circle within tolerance", () => {
  const r = 50;
  const [sub] = parsePathData(shapePathData("circle", { cx: 0, cy: 0, r })!);
  const [polyline] = flattenSubpaths([sub], 0.01);
  assert.equal(polyline.closed, true);
  for (const [x, y] of polyline.points) assert.ok(Math.abs(Math.hypot(x, y) - r) < 0.05, `off-circle point ${x},${y}`);
  assert.equal(arcToCubics([0, 0], [10, 0], 0, 5, 0, false, true).length, 1); // zero radius → straight line
});

test("shapePathData handles rounded rects and polygons", () => {
  assert.equal(shapePathData("rect", { x: 0, y: 0, width: 10, height: 5 }), "M0 0H10V5H0Z");
  assert.match(shapePathData("rect", { x: 0, y: 0, width: 10, height: 10, rx: 2 })!, /A2 2 0 0 1/);
  assert.equal(shapePathData("polygon", { points: "0,0 10,0 10,10" }), "M0 0L10 0L10 10Z");
  assert.equal(shapePathData("rect", { width: 0, height: 5 }), null);
});

test("nearestAci maps colors to the shared AutoCAD palette", () => {
  assert.equal(nearestAci("#DC1E1E"), 1);
  assert.equal(nearestAci("143CC8"), 5);
  assert.equal(nearestAci("#000000"), 7);
  assert.equal(nearestAci("#FFFFFF"), 7);
});

test("writeDxf emits an R12 file with layers and closed polylines", () => {
  const dxf = writeDxf(
    [{ layer: "CUT", closed: true, points: [[0, 0], [10, 0], [10, 10]] }],
    [{ name: "CUT", color: 7 }],
    "mm",
  );
  const lines = dxf.split("\r\n");
  assert.equal(lines[lines.indexOf("$ACADVER") + 2], "AC1009");
  assert.equal(lines[lines.indexOf("$INSUNITS") + 2], "4");
  assert.equal(lines.filter((l) => l === "VERTEX").length, 3);
  assert.ok(dxf.endsWith("0\r\nEOF\r\n"));
});
