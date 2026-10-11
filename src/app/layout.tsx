import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

// Fonts are self-hosted (src/fonts, OFL). next/font/google downloads them during the build,
// and when that download flakes on Cloudflare's builders the whole build fails
// ("Can't resolve '@vercel/turbopack-next/internal/font/google/font'", 2026-10-06).
const display = localFont({ src: "../fonts/bricolage-grotesque-latin-wght-normal.woff2", variable: "--font-display", weight: "200 800", display: "swap" });
const body = localFont({ src: "../fonts/manrope-latin-wght-normal.woff2", variable: "--font-body", weight: "200 800", display: "swap" });

const OG_IMAGE = "https://visualrefiner.com/og.png?v=2";

export const metadata: Metadata = {
  metadataBase: new URL("https://visualrefiner.com"),
  title: { default: "VisualRefiner — PNG to SVG, SVG to DXF & Image Tools, No Upload", template: "%s — VisualRefiner" },
  description:
    "Turn images into SVG and DXF cut files for Cricut, laser, and CNC, plus everyday image and video converters. Everything runs in your browser, nothing is uploaded.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "VisualRefiner",
    // No title/description here on purpose: Next falls og:title / og:description back to
    // each page's own title/description, so every page gets a correct per-page card.
    url: "https://visualrefiner.com",
    // Absolute URL + ?v= so social platforms refetch after the image changes (source: scripts/og.svg).
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "VisualRefiner: turn images into SVG and DXF cut files" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* No Google Analytics on purpose: a no-upload privacy tool can't ship a
          third-party tracker (it also blocks privacy-list listings). Visits are
          counted by Cloudflare Web Analytics, which the edge injects — cookieless. */}
      <body className={`${display.variable} ${body.variable}`}>
        {/*
          THESIS: Visual files enter a precision inspection bench, refusing the generic SaaS hero and card grid.
          OWN-WORLD: Celadon-grey surfaces, graphite type, calibration orange actions, crop ticks, and an inspection lens.
          STORY: Choose a task, see local processing, finish it, and download the result.
          FIRST VIEWPORT: An asymmetrical title faces a dominant working image field with the primary action inside it.
          FORM: Precision inspection bench, grounded direction six, seed 56192447.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
        */}
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
