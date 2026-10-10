import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { guides } from "@/lib/guides";
import { conversions } from "@/lib/conversions";

export const dynamic = "force-static";

// lastmod = the last commit that touched the route's page file. Every URL used
// to share one hardcoded date (2026-08-11), which tells Google nothing about
// what's new. In a shallow clone the history is missing, so lastmod is left
// out rather than stamping every page with the same build-day date.
const shallow = (() => {
  try {
    return execFileSync("git", ["rev-parse", "--is-shallow-repository"], { encoding: "utf8" }).trim() !== "false";
  } catch {
    return true;
  }
})();

function lastModified(route: string): Date | undefined {
  if (shallow) return undefined;
  const file = `src/app${route}/page.tsx`;
  if (!existsSync(file)) return undefined;
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { encoding: "utf8" }).trim();
    return iso ? new Date(iso) : undefined;
  } catch {
    return undefined;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", ...tools.map((tool) => tool.slug), ...conversions.map((c) => c.slug), "/guides", ...guides.map((guide) => guide.slug), "/about", "/privacy", "/terms", "/open-source"];
  return [...new Set(routes)].map((route) => ({
    url: `https://visualrefiner.com${route}`,
    lastModified: lastModified(route),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/privacy") || route.startsWith("/terms") ? 0.2 : 0.8,
  }));
}
