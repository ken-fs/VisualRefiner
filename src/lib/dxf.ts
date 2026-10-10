/**
 * SVG geometry → DXF, with no dependencies.
 *
 * DXF has no curves we can rely on across laser/CNC/CAD software, so every
 * path is flattened into polylines within a chord tolerance and written as
 * R12 (AC1009) POLYLINE entities — the oldest, most widely readable flavor
 * (LightBurn, xTool Creative Space, Inkscape, LibreCAD, Fusion, AutoCAD).
 *
 * Everything here is pure; src/lib/svg-geometry.ts does the DOM part
 * (transforms, computed colors) in the browser.
 */

export type Point = [number, number];
type Segment = { kind: "line"; to: Point } | { kind: "cubic"; c1: Point; c2: Point; to: Point };
export type Subpath = { start: Point; segments: Segment[]; closed: boolean };
export type Polyline = { points: Point[]; closed: boolean };

// --- path data parsing -------------------------------------------------------

const PARAMS: Record<string, number> = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };

/** Reads SVG path data into absolute lines and cubics (quads and arcs converted). */
export function parsePathData(d: string): Subpath[] {
  const subpaths: Subpath[] = [];
  let index = 0;

  const skip = () => {
    while (index < d.length && /[\s,]/.test(d[index])) index++;
  };
  const number = (): number => {
    skip();
    const match = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/.exec(d.slice(index));
    if (!match) throw new Error(`Bad path data near "${d.slice(index, index + 12)}"`);
    index += match[0].length;
    return Number(match[0]);
  };
  // Arc flags may be written without separators ("a1 1 0 01 5 5").
  const flag = (): number => {
    skip();
    const char = d[index];
    if (char !== "0" && char !== "1") throw new Error("Bad arc flag in path data");
    index++;
    return Number(char);
  };
  const hasNumber = () => {
    skip();
    return index < d.length && /[-+.\d]/.test(d[index]);
  };

  let current: Point = [0, 0];
  let subpath: Subpath | null = null;
  let lastCubic: Point | null = null; // second control point, for S
  let lastQuad: Point | null = null; // control point, for T

  const open = () => {
    if (!subpath) {
      subpath = { start: current, segments: [], closed: false };
      subpaths.push(subpath);
    }
    return subpath;
  };
  const line = (to: Point) => {
    open().segments.push({ kind: "line", to });
    current = to;
  };
  const cubic = (c1: Point, c2: Point, to: Point) => {
    open().segments.push({ kind: "cubic", c1, c2, to });
    current = to;
  };

  let command = "";
  while (true) {
    skip();
    if (index >= d.length) break;
    if (/[a-zA-Z]/.test(d[index])) {
      command = d[index++];
    } else if (!command) {
      throw new Error("Path data must start with a command");
    }
    if (!(command.toLowerCase() in PARAMS)) throw new Error(`Unknown path command "${command}"`);

    // Each command may repeat its parameter group (implicit repetition). The
    // command can change mid-run: extra pairs after a moveto are linetos.
    do {
      const lower = command.toLowerCase();
      const relative = command !== command.toUpperCase();
      const at = (x: number, y: number): Point => (relative ? [current[0] + x, current[1] + y] : [x, y]);
      if (lower === "z") {
        if (subpath) {
          subpath.closed = true;
          current = subpath.start;
          subpath = null;
        }
        lastCubic = lastQuad = null;
        break;
      }
      if (lower === "m") {
        const to = at(number(), number());
        current = to;
        subpath = { start: to, segments: [], closed: false };
        subpaths.push(subpath);
        command = relative ? "l" : "L";
        lastCubic = lastQuad = null;
        continue;
      }
      if (lower === "l") {
        line(at(number(), number()));
        lastCubic = lastQuad = null;
      } else if (lower === "h") {
        const x = number();
        line([relative ? current[0] + x : x, current[1]]);
        lastCubic = lastQuad = null;
      } else if (lower === "v") {
        const y = number();
        line([current[0], relative ? current[1] + y : y]);
        lastCubic = lastQuad = null;
      } else if (lower === "c") {
        const c1 = at(number(), number());
        const c2 = at(number(), number());
        const to = at(number(), number());
        cubic(c1, c2, to);
        lastCubic = c2;
        lastQuad = null;
      } else if (lower === "s") {
        const from = current;
        const c1: Point = lastCubic ? [2 * from[0] - lastCubic[0], 2 * from[1] - lastCubic[1]] : from;
        const c2 = at(number(), number());
        const to = at(number(), number());
        cubic(c1, c2, to);
        lastCubic = c2;
        lastQuad = null;
      } else if (lower === "q") {
        const from = current;
        const q = at(number(), number());
        const to = at(number(), number());
        cubic(...quadToCubic(from, q, to), to);
        lastQuad = q;
        lastCubic = null;
      } else if (lower === "t") {
        const from = current;
        const q: Point = lastQuad ? [2 * from[0] - lastQuad[0], 2 * from[1] - lastQuad[1]] : from;
        const to = at(number(), number());
        cubic(...quadToCubic(from, q, to), to);
        lastQuad = q;
        lastCubic = null;
      } else if (lower === "a") {
        const rx = number();
        const ry = number();
        const rotation = number();
        const large = flag();
        const sweep = flag();
        const to = at(number(), number());
        for (const [c1, c2, end] of arcToCubics(current, to, rx, ry, rotation, large === 1, sweep === 1)) cubic(c1, c2, end);
        current = to;
        lastCubic = lastQuad = null;
      }
    } while (hasNumber());
  }
  return subpaths;
}

function quadToCubic(from: Point, q: Point, to: Point): [Point, Point] {
  return [
    [from[0] + (2 / 3) * (q[0] - from[0]), from[1] + (2 / 3) * (q[1] - from[1])],
    [to[0] + (2 / 3) * (q[0] - to[0]), to[1] + (2 / 3) * (q[1] - to[1])],
  ];
}

/** SVG elliptical arc (endpoint form) → cubic Béziers, per SVG 1.1 appendix F.6. */
export function arcToCubics(
  from: Point,
  to: Point,
  rxIn: number,
  ryIn: number,
  rotationDegrees: number,
  largeArc: boolean,
  sweep: boolean,
): [Point, Point, Point][] {
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (rx === 0 || ry === 0 || (from[0] === to[0] && from[1] === to[1])) {
    return rx === 0 || ry === 0 ? [[from, to, to]] : [];
  }
  const phi = (rotationDegrees * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx = (from[0] - to[0]) / 2;
  const dy = (from[1] - to[1]) / 2;
  const x1 = cos * dx + sin * dy;
  const y1 = -sin * dx + cos * dy;

  // Scale radii up if they can't span the endpoints.
  const lambda = (x1 * x1) / (rx * rx) + (y1 * y1) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }
  const numerator = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1;
  const denominator = rx * rx * y1 * y1 + ry * ry * x1 * x1;
  let factor = Math.sqrt(Math.max(0, numerator / denominator));
  if (largeArc === sweep) factor = -factor;
  const cxp = (factor * rx * y1) / ry;
  const cyp = (-factor * ry * x1) / rx;
  const cx = cos * cxp - sin * cyp + (from[0] + to[0]) / 2;
  const cy = sin * cxp + cos * cyp + (from[1] + to[1]) / 2;

  const angle = (ux: number, uy: number, vx: number, vy: number) => {
    const sign = ux * vy - uy * vx < 0 ? -1 : 1;
    const dot = (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy));
    return sign * Math.acos(Math.min(1, Math.max(-1, dot)));
  };
  const theta = angle(1, 0, (x1 - cxp) / rx, (y1 - cyp) / ry);
  let delta = angle((x1 - cxp) / rx, (y1 - cyp) / ry, (-x1 - cxp) / rx, (-y1 - cyp) / ry);
  if (!sweep && delta > 0) delta -= 2 * Math.PI;
  if (sweep && delta < 0) delta += 2 * Math.PI;

  // Split into ≤90° pieces; each piece is a standard cubic arc approximation.
  const pieces = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2) - 1e-9));
  const step = delta / pieces;
  const k = (4 / 3) * Math.tan(step / 4);
  const point = (t: number): Point => [
    cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin,
    cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos,
  ];
  const derivative = (t: number): Point => [
    -rx * Math.sin(t) * cos - ry * Math.cos(t) * sin,
    -rx * Math.sin(t) * sin + ry * Math.cos(t) * cos,
  ];
  const result: [Point, Point, Point][] = [];
  for (let i = 0; i < pieces; i++) {
    const t1 = theta + i * step;
    const t2 = t1 + step;
    const p1 = point(t1);
    const p2 = i === pieces - 1 ? to : point(t2);
    const d1 = derivative(t1);
    const d2 = derivative(t2);
    result.push([
      [p1[0] + k * d1[0], p1[1] + k * d1[1]],
      [p2[0] - k * d2[0], p2[1] - k * d2[1]],
      p2,
    ]);
  }
  return result;
}

// --- basic shapes -> path data -------------------------------------------------

export type ShapeAttributes = Record<string, number | string | undefined>;

/** Path data for the SVG basic shapes, from already-resolved numeric attributes. */
export function shapePathData(tag: string, a: ShapeAttributes): string | null {
  const n = (key: string) => Number(a[key] ?? 0) || 0;
  switch (tag) {
    case "rect": {
      const x = n("x");
      const y = n("y");
      const w = n("width");
      const h = n("height");
      if (w <= 0 || h <= 0) return null;
      let rx = a.rx === undefined ? undefined : n("rx");
      let ry = a.ry === undefined ? undefined : n("ry");
      rx ??= ry ?? 0;
      ry ??= rx;
      rx = Math.min(Math.max(0, rx), w / 2);
      ry = Math.min(Math.max(0, ry), h / 2);
      if (rx === 0 || ry === 0) return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
      return (
        `M${x + rx} ${y}H${x + w - rx}A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}` +
        `V${y + h - ry}A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}` +
        `H${x + rx}A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}` +
        `V${y + ry}A${rx} ${ry} 0 0 1 ${x + rx} ${y}Z`
      );
    }
    case "circle":
    case "ellipse": {
      const cx = n("cx");
      const cy = n("cy");
      const rx = tag === "circle" ? n("r") : n("rx");
      const ry = tag === "circle" ? n("r") : n("ry");
      if (rx <= 0 || ry <= 0) return null;
      return `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`;
    }
    case "line":
      return `M${n("x1")} ${n("y1")}L${n("x2")} ${n("y2")}`;
    case "polyline":
    case "polygon": {
      const values = String(a.points ?? "").trim().split(/[\s,]+/).filter(Boolean).map(Number);
      if (values.length < 4 || values.some((v) => !Number.isFinite(v))) return null;
      const pairs: string[] = [];
      for (let i = 0; i + 1 < values.length; i += 2) pairs.push(`${values[i]} ${values[i + 1]}`);
      return `M${pairs.join("L")}${tag === "polygon" ? "Z" : ""}`;
    }
    default:
      return null;
  }
}

// --- flattening ----------------------------------------------------------------

function flattenCubic(p0: Point, c1: Point, c2: Point, p3: Point, tolerance: number, out: Point[], depth = 0) {
  // Flat enough when both control points sit within tolerance of the chord.
  const dx = p3[0] - p0[0];
  const dy = p3[1] - p0[1];
  const length = Math.hypot(dx, dy);
  const distance = (p: Point) =>
    length < 1e-12 ? Math.hypot(p[0] - p0[0], p[1] - p0[1]) : Math.abs((p[0] - p0[0]) * dy - (p[1] - p0[1]) * dx) / length;
  if (depth >= 18 || Math.max(distance(c1), distance(c2)) <= tolerance) {
    out.push(p3);
    return;
  }
  const mid = (a: Point, b: Point): Point => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const a = mid(p0, c1);
  const b = mid(c1, c2);
  const c = mid(c2, p3);
  const ab = mid(a, b);
  const bc = mid(b, c);
  const center = mid(ab, bc);
  flattenCubic(p0, a, ab, center, tolerance, out, depth + 1);
  flattenCubic(center, bc, c, p3, tolerance, out, depth + 1);
}

/** Lines and cubics → polylines whose chords stay within `tolerance` of the curve. */
export function flattenSubpaths(subpaths: Subpath[], tolerance: number): Polyline[] {
  const result: Polyline[] = [];
  for (const subpath of subpaths) {
    const points: Point[] = [subpath.start];
    let current = subpath.start;
    for (const segment of subpath.segments) {
      if (segment.kind === "line") points.push(segment.to);
      else flattenCubic(current, segment.c1, segment.c2, segment.to, tolerance, points);
      current = segment.to;
    }
    // Drop consecutive duplicates; a closed polyline doesn't repeat its start.
    const clean = points.filter((p, i) => i === 0 || Math.hypot(p[0] - points[i - 1][0], p[1] - points[i - 1][1]) > 1e-9);
    if (subpath.closed && clean.length > 1) {
      const first = clean[0];
      const last = clean[clean.length - 1];
      if (Math.hypot(first[0] - last[0], first[1] - last[1]) <= 1e-9) clean.pop();
    }
    if (clean.length >= 2) result.push({ points: clean, closed: subpath.closed });
  }
  return result;
}

// --- DXF writing ---------------------------------------------------------------

export type DxfUnit = "mm" | "in";
export type DxfLayer = { name: string; color: number };
export type DxfEntity = Polyline & { layer: string };

// AutoCAD Color Index entries every DXF reader agrees on. 7 renders black on a
// light background and white on a dark one.
const ACI: [number, [number, number, number]][] = [
  [1, [255, 0, 0]],
  [2, [255, 255, 0]],
  [3, [0, 255, 0]],
  [4, [0, 255, 255]],
  [5, [0, 0, 255]],
  [6, [255, 0, 255]],
  [7, [0, 0, 0]],
  [8, [128, 128, 128]],
  [9, [192, 192, 192]],
];

export function nearestAci(hex: string): number {
  const match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!match) return 7;
  const rgb = match.slice(1).map((h) => parseInt(h, 16));
  // Near-white also maps to 7: white-on-white would vanish in a viewer.
  if (rgb.every((v) => v > 225)) return 7;
  let best = 7;
  let bestDistance = Infinity;
  for (const [index, color] of ACI) {
    const distance = color.reduce((sum, c, i) => sum + (c - rgb[i]) ** 2, 0);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  }
  return best;
}

const fmt = (value: number) => {
  const fixed = value.toFixed(4);
  return fixed.includes(".") ? fixed.replace(/\.?0+$/, "") || "0" : fixed;
};

/** Writes entities as an R12 DXF. Coordinates are already in output units, y-up. */
export function writeDxf(entities: DxfEntity[], layers: DxfLayer[], unit: DxfUnit): string {
  const lines: (string | number)[] = [];
  const pair = (code: number, value: string | number) => lines.push(code, value);

  let maxX = 0;
  let maxY = 0;
  for (const entity of entities) {
    for (const [x, y] of entity.points) {
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  pair(0, "SECTION");
  pair(2, "HEADER");
  pair(9, "$ACADVER");
  pair(1, "AC1009");
  pair(9, "$INSUNITS");
  pair(70, unit === "mm" ? 4 : 1);
  pair(9, "$EXTMIN");
  pair(10, 0);
  pair(20, 0);
  pair(9, "$EXTMAX");
  pair(10, fmt(maxX));
  pair(20, fmt(maxY));
  pair(0, "ENDSEC");

  pair(0, "SECTION");
  pair(2, "TABLES");
  pair(0, "TABLE");
  pair(2, "LTYPE");
  pair(70, 1);
  pair(0, "LTYPE");
  pair(2, "CONTINUOUS");
  pair(70, 0);
  pair(3, "Solid line");
  pair(72, 65);
  pair(73, 0);
  pair(40, 0);
  pair(0, "ENDTAB");
  pair(0, "TABLE");
  pair(2, "LAYER");
  pair(70, layers.length);
  for (const layer of layers) {
    pair(0, "LAYER");
    pair(2, layer.name);
    pair(70, 0);
    pair(62, layer.color);
    pair(6, "CONTINUOUS");
  }
  pair(0, "ENDTAB");
  pair(0, "ENDSEC");

  pair(0, "SECTION");
  pair(2, "ENTITIES");
  for (const entity of entities) {
    pair(0, "POLYLINE");
    pair(8, entity.layer);
    pair(66, 1);
    pair(10, 0);
    pair(20, 0);
    pair(30, 0);
    pair(70, entity.closed ? 1 : 0);
    for (const [x, y] of entity.points) {
      pair(0, "VERTEX");
      pair(8, entity.layer);
      pair(10, fmt(x));
      pair(20, fmt(y));
      pair(30, 0);
    }
    pair(0, "SEQEND");
    pair(8, entity.layer);
  }
  pair(0, "ENDSEC");
  pair(0, "EOF");
  return lines.join("\r\n") + "\r\n";
}
