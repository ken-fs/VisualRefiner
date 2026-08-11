import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://visualrefiner.com"),
  title: { default: "VisualRefiner — Local Image and Video Tools", template: "%s — VisualRefiner" },
  description: "Convert, compress, resize, and extract image or video files in your browser.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "VisualRefiner",
    title: "VisualRefiner — Local Image and Video Tools",
    description: "Useful visual tools. Files stay in your browser.",
    url: "https://visualrefiner.com",
  },
  twitter: { card: "summary_large_image", title: "VisualRefiner", description: "Useful visual tools. Files stay in your browser." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        {/*
          THESIS: Visual files enter a precision inspection bench, refusing the generic SaaS hero and card grid.
          OWN-WORLD: Celadon-grey surfaces, graphite type, calibration orange actions, crop ticks, and an inspection lens.
          STORY: Choose a task, see local processing, finish it, and download the result.
          FIRST VIEWPORT: An asymmetrical title faces a dominant working image field with the primary action inside it.
          FORM: Precision inspection bench, grounded direction six, seed 56192447.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
        */}
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
