import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { guides } from "@/lib/guides";
import { conversions } from "@/lib/conversions";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", ...tools.map((tool) => tool.slug), ...conversions.map((c) => c.slug), "/guides", ...guides.map((guide) => guide.slug), "/about", "/privacy", "/terms", "/open-source"];
  return [...new Set(routes)].map((route) => ({ url: `https://visualrefiner.com${route}`, lastModified: new Date("2026-08-11"), changeFrequency: route === "" ? "weekly" : "monthly", priority: route === "" ? 1 : route.startsWith("/privacy") || route.startsWith("/terms") ? 0.2 : 0.8 }));
}
