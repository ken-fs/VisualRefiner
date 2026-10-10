// Cloudflare builds from a shallow clone, so `git log` has no history and the
// sitemap can't date pages (src/app/sitemap.ts then omits lastmod). Fetch the
// full history first. The repo is public, so this needs no credentials; any
// failure just leaves the sitemap without lastmod instead of failing the build.
import { execFileSync } from "node:child_process";

try {
  const shallow = execFileSync("git", ["rev-parse", "--is-shallow-repository"], { encoding: "utf8" }).trim() === "true";
  if (shallow) {
    execFileSync("git", ["fetch", "--unshallow", "--quiet"], { stdio: "inherit", timeout: 90_000 });
    console.log("unshallow: fetched full history for sitemap lastmod");
  }
} catch (error) {
  console.warn(`unshallow: skipped (${error instanceof Error ? error.message : error})`);
}
