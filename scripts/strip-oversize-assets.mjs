// Cloudflare Workers static assets reject files above 25 MiB. The ONNX runtime
// WASM (~26MB, asyncify build) trips this, so transcriber.ts loads it from the
// CDN instead — this script removes the local copy from the build output.
// Only .wasm files are touched; anything else oversize fails the deploy loudly
// on purpose, so the limit never gets "fixed" by silently deleting content.
import { readdirSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const LIMIT = 25 * 1024 * 1024;
const ROOT = "out";
let stripped = 0;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(path);
      continue;
    }
    if (!entry.name.endsWith(".wasm")) continue;
    const { size } = statSync(path);
    if (size > LIMIT) {
      unlinkSync(path);
      stripped += 1;
      console.log(`strip-oversize-assets: removed ${path} (${(size / 1024 / 1024).toFixed(1)} MB > 25 MiB, served from CDN)`);
    }
  }
}

walk(ROOT);
if (stripped === 0) console.log("strip-oversize-assets: nothing to strip");
