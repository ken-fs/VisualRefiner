// Renders scripts/og.svg to public/og.png (1200x630) with headless Chrome, so the
// self-hosted Bricolage Grotesque / Manrope fonts load (rsvg-convert ignores @font-face).
// After changing the image, bump the ?v= in src/app/layout.tsx so social caches refetch.
// Usage: node scripts/render-og.mjs   (override the browser with CHROME=/path/to/chrome)
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const src = pathToFileURL(resolve("scripts/og.svg")).href;
const out = resolve("public/og.png");

execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--allow-file-access-from-files",
  "--force-device-scale-factor=1",
  "--window-size=1200,630",
  "--virtual-time-budget=3000",
  `--screenshot=${out}`,
  src,
], { stdio: "inherit" });

console.log(`wrote ${out}`);
