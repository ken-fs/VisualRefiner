/**
 * SVG markup → DXF in the browser.
 *
 * The SVG is mounted off-screen so the browser resolves what is painful to do
 * by hand: nested transforms (getScreenCTM), CSS classes and inherited fills
 * (getComputedStyle), and length units on basic shapes (baseVal). Geometry is
 * then flattened and written by the pure helpers in src/lib/dxf.ts.
 */

import {
  flattenSubpaths,
  nearestAci,
  parsePathData,
  shapePathData,
  writeDxf,
  type DxfEntity,
  type DxfLayer,
  type DxfUnit,
  type Point,
  type Subpath,
} from "@/lib/dxf";

export type DxfOptions = {
  /** Output width in `unit`; height follows the drawing's aspect ratio. */
  width: number;
  unit: DxfUnit;
  /** Max distance between a curve and its polyline, in millimetres. */
  accuracyMm: number;
  layersByColor: boolean;
};

export type DxfResult = {
  dxf: string;
  width: number;
  height: number;
  entities: number;
  points: number;
  layers: number;
  skipped: number;
};

const SHAPES = "path,rect,circle,ellipse,line,polyline,polygon";
const NON_RENDERED = "defs,clipPath,mask,symbol,pattern,marker,linearGradient,radialGradient,filter";

type Shape = { subpaths: Subpath[]; matrix: DOMMatrix; color: string };

function toHex(cssColor: string): string | null {
  const match = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(cssColor);
  if (!match) return null;
  return match.slice(1, 4).map((v) => Number(v).toString(16).padStart(2, "0")).join("").toUpperCase();
}

/** Strips anything that could run code or fetch from the network once mounted. */
function sanitize(root: Element) {
  root.querySelectorAll("script,foreignObject,image,iframe,audio,video").forEach((el) => el.remove());
  root.querySelectorAll("style").forEach((el) => {
    el.textContent = (el.textContent ?? "").replace(/@import[^;]*;?/gi, "").replace(/url\(\s*['"]?(?!#)[^)]*\)/gi, "none");
  });
  for (const el of [root, ...root.querySelectorAll("*")]) {
    for (const attribute of [...el.attributes]) {
      const name = attribute.name.toLowerCase();
      if (name.startsWith("on")) el.removeAttribute(attribute.name);
      else if ((name === "href" || name === "xlink:href") && !attribute.value.trim().startsWith("#")) el.removeAttribute(attribute.name);
    }
  }
}

/** Replaces <use href="#id"> with a transformed copy of its target, so it shows up in the tree. */
function expandUses(root: Element): number {
  let skipped = 0;
  for (let pass = 0; pass < 4; pass++) {
    const uses = [...root.querySelectorAll("use")];
    if (!uses.length) break;
    for (const use of uses) {
      const href = use.getAttribute("href") ?? use.getAttribute("xlink:href") ?? "";
      const target = href.startsWith("#") ? root.querySelector(`[id="${CSS.escape(href.slice(1))}"]`) : null;
      if (!target || target.tagName.toLowerCase() === "symbol" || target.contains(use)) {
        skipped++;
        use.remove();
        continue;
      }
      const group = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "g");
      const x = Number.parseFloat(use.getAttribute("x") ?? "0") || 0;
      const y = Number.parseFloat(use.getAttribute("y") ?? "0") || 0;
      group.setAttribute("transform", `${use.getAttribute("transform") ?? ""} translate(${x} ${y})`.trim());
      for (const attribute of ["fill", "stroke", "class", "style"]) {
        const value = use.getAttribute(attribute);
        if (value) group.setAttribute(attribute, value);
      }
      const copy = target.cloneNode(true) as Element;
      copy.removeAttribute("id");
      group.append(copy);
      use.replaceWith(group);
    }
  }
  return skipped;
}

function isHidden(el: Element, root: Element): boolean {
  for (let node: Element | null = el; node && node !== root.parentElement; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return true;
  }
  return false;
}

function pathDataFor(el: SVGGeometryElement): string | null {
  const tag = el.tagName.toLowerCase();
  if (tag === "path") return el.getAttribute("d");
  // baseVal resolves units and percentages against the viewport.
  const length = (name: string) => (el as unknown as Record<string, SVGAnimatedLength | undefined>)[name]?.baseVal.value;
  if (tag === "polyline" || tag === "polygon") return shapePathData(tag, { points: el.getAttribute("points") ?? "" });
  const keys: Record<string, string[]> = {
    rect: ["x", "y", "width", "height", "rx", "ry"],
    circle: ["cx", "cy", "r"],
    ellipse: ["cx", "cy", "rx", "ry"],
    line: ["x1", "y1", "x2", "y2"],
  };
  const attributes: Record<string, number | undefined> = {};
  for (const key of keys[tag] ?? []) {
    // A missing rx/ry on <rect> must stay undefined (it means "same as the other one").
    attributes[key] = (key === "rx" || key === "ry") && !el.hasAttribute(key) ? undefined : length(key);
  }
  return shapePathData(tag, attributes);
}

function collectShapes(markup: string): { shapes: Shape[]; skipped: number } {
  const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
  const source = parsed.documentElement;
  if (parsed.querySelector("parsererror") || source.nodeName.toLowerCase() !== "svg") {
    throw new Error("This file is not a readable SVG.");
  }
  sanitize(source);
  let skipped = expandUses(source);

  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = "position:fixed;left:-100000px;top:0;width:1000px;height:1000px;overflow:hidden;opacity:0;pointer-events:none";
  const root = document.importNode(source, true) as unknown as SVGSVGElement;
  host.append(root);
  document.body.append(host);
  try {
    const rootMatrix = root.getScreenCTM();
    if (!rootMatrix) throw new Error("Could not measure this SVG.");
    const toRoot = rootMatrix.inverse();
    const shapes: Shape[] = [];
    for (const el of root.querySelectorAll<SVGGeometryElement>(SHAPES)) {
      if (el.closest(NON_RENDERED) || isHidden(el, root)) continue;
      const style = getComputedStyle(el);
      const color = toHex(style.fill) ?? toHex(style.stroke) ?? (style.fill.startsWith("url(") ? "000000" : null);
      if (!color) continue; // fill and stroke both none: nothing visible to cut
      const d = pathDataFor(el);
      const screen = el.getScreenCTM();
      if (!d || !screen) continue;
      try {
        shapes.push({ subpaths: parsePathData(d), matrix: toRoot.multiply(screen), color });
      } catch {
        skipped++;
      }
    }
    return { shapes, skipped };
  } finally {
    host.remove();
  }
}

const apply = (m: DOMMatrix, [x, y]: Point): Point => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];

export function svgToDxf(markup: string, options: DxfOptions): DxfResult {
  const { shapes, skipped } = collectShapes(markup);

  // Control points bound the curves, so their box gives the scale to pick a
  // flattening tolerance before the exact outline is known.
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const grow = ([x, y]: Point) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };
  for (const shape of shapes) {
    for (const subpath of shape.subpaths) {
      grow(apply(shape.matrix, subpath.start));
      for (const segment of subpath.segments) {
        if (segment.kind === "cubic") {
          grow(apply(shape.matrix, segment.c1));
          grow(apply(shape.matrix, segment.c2));
        }
        grow(apply(shape.matrix, segment.to));
      }
    }
  }
  if (!Number.isFinite(minX)) throw new Error("No shapes found to convert. Text must be converted to outlines (paths) first.");

  const unitsPerMm = options.unit === "mm" ? 1 : 1 / 25.4;
  const roughScale = options.width / Math.max(maxX - minX, maxY - minY, 1e-9);
  const lines: { points: Point[]; closed: boolean; color: string }[] = [];
  minX = minY = Infinity;
  maxX = maxY = -Infinity;
  for (const shape of shapes) {
    const m = shape.matrix;
    const localScale = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) || 1;
    const tolerance = (options.accuracyMm * unitsPerMm) / (roughScale * localScale);
    for (const polyline of flattenSubpaths(shape.subpaths, tolerance)) {
      const points = polyline.points.map((p) => apply(m, p));
      points.forEach(grow);
      lines.push({ points, closed: polyline.closed, color: shape.color });
    }
  }

  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const scale = options.width / (spanX > 1e-9 ? spanX : Math.max(spanY, 1e-9));
  const layerOf = (color: string) => (options.layersByColor ? `COLOR_${color}` : "VECTOR");
  const layers = new Map<string, DxfLayer>();
  const entities: DxfEntity[] = lines.map((line) => {
    const layer = layerOf(line.color);
    if (!layers.has(layer)) layers.set(layer, { name: layer, color: options.layersByColor ? nearestAci(line.color) : 7 });
    // DXF is y-up; SVG is y-down. Move the drawing's corner to the origin.
    return { layer, closed: line.closed, points: line.points.map(([x, y]) => [(x - minX) * scale, (maxY - y) * scale] as Point) };
  });

  return {
    dxf: writeDxf(entities, [...layers.values()], options.unit),
    width: spanX * scale,
    height: spanY * scale,
    entities: entities.length,
    points: entities.reduce((sum, e) => sum + e.points.length, 0),
    layers: layers.size,
    skipped,
  };
}
