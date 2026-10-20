import type { Metadata } from "next";
import Link from "next/link";
import { SvgConvertWorkspace } from "@/components/SvgConvertWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "SVG Converter — Convert SVG to PNG, JPG or WebP Free",
  description:
    "Convert an SVG to PNG, JPG or WebP at 1×, 2× or 4× scale, with the format picked on the page. No upload, no sign-up — the file is rasterized in your browser.",
  alternates: { canonical: "/svg-converter" },
};

export default function SvgConverterPage() {
  return (
    <ToolPageShell
      title="SVG converter"
      description="Drop an SVG, choose the format you need out — PNG, JPG or WebP — and set the render size."
      note="Converted in this tab"
      slug="/svg-converter"
      steps={[
        "Choose or drop an SVG file.",
        "Pick the output format: PNG for transparency, JPG for the smallest photo-like file, WebP for the smallest file overall.",
        "Set the render scale, convert, and download.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">Converting an SVG to an image format</h2>
          <p>
            SVG is a vector format: it stores shapes and paths, not pixels. That&apos;s ideal for logos,
            icons and diagrams — it stays sharp at any size — but plenty of software still only accepts a
            raster file. This page does the one job those tools can&apos;t: it turns the vectors into pixels.
          </p>

          <h3>Which output format to pick</h3>
          <p>
            The choice is about transparency and file size, not quality — an SVG rendered at the same size
            produces the same picture either way.
          </p>
          <ul>
            <li>
              <strong>PNG</strong> keeps transparency and stays lossless. Use it for icons, logos and
              anything that will sit on a coloured background.
            </li>
            <li>
              <strong>JPG</strong> is the smallest option for images without transparency, but it has no
              alpha channel — transparent areas come out white — and its compression softens sharp edges.
            </li>
            <li>
              <strong>WebP</strong> supports transparency and is usually 30–70% smaller than PNG at
              comparable quality. It is the right default for the web, as long as whatever reads the file
              supports it.
            </li>
          </ul>

          <h3>The setting that actually matters: render size</h3>
          <p>
            A vector file has no fixed resolution, so &ldquo;convert to PNG&rdquo; is really &ldquo;convert
            to PNG at <em>some</em> size&rdquo;. Rendering a 24px icon at 1× gives you 24 blurry pixels on a
            retina screen — render at 2× or 4× and let the display scale it down. For a poster-size export,
            use 1× at a large declared size, or 2× if your SVG was drawn small.
          </p>
          <p>
            The result panel shows the output pixel dimensions before you download, so you can check that
            scale before saving a file you have to throw away.
          </p>

          <h3>One page, or a specific pair</h3>
          <p>
            If you already know the target format, the dedicated pages say more about that one conversion:{" "}
            <Link href="/svg-to-png">SVG to PNG</Link>, <Link href="/svg-to-jpg">SVG to JPG</Link> and{" "}
            <Link href="/svg-to-webp">SVG to WebP</Link>. Going the other way — a raster logo that needs to
            become vector — is <Link href="/png-to-svg">PNG to SVG</Link>, which traces the shapes rather
            than embedding the bitmap.
          </p>
          <p>
            Need the SVG exported for a laser cutter or CNC instead of a screen? That is{" "}
            <Link href="/svg-to-dxf">SVG to DXF</Link>, which keeps the paths as cutting geometry.
          </p>

          <h3>Nothing gets uploaded</h3>
          <p>
            The SVG is parsed and drawn onto a canvas inside this tab. No server sees the file, so it works
            for client material and unreleased designs, and it keeps working offline.
          </p>
        </>
      }
      faqs={[
        {
          question: "Can I convert more than one SVG at a time?",
          answer:
            "One file per conversion. Batch conversion is not built in — if you have a folder of icons, each one needs its own run, or a command-line tool like Inkscape (\u0060inkscape --export-type=png\u0060) will be faster.",
        },
        {
          question: "Does the converter keep transparency?",
          answer:
            "PNG and WebP keep it. JPG has no alpha channel, so transparent areas are filled with white — pick PNG or WebP if the logo has to sit on an unknown background.",
        },
        {
          question: "Why does an embedded raster image look soft?",
          answer:
            "An SVG can carry a bitmap inside it. Rasterizing that SVG can only sample the pixels that are already there, so scaling it up looks blurry. The softness is in the source file, not in the conversion.",
        },
        {
          question: "Is there a size limit?",
          answer:
            "There is no upload limit because nothing is uploaded. Very large or very complex files are limited by your browser: a 4× render of a detailed illustration can take a few seconds and a lot of memory.",
        },
        {
          question: "Can I get an SVG back out of a PNG here?",
          answer:
            "Not from this page — that is tracing, not converting. The PNG to SVG tool redraws the bitmap as vector paths; the result is a close reconstruction, not the original file.",
        },
      ]}
    >
      <SvgConvertWorkspace defaultFormat="image/png" />
    </ToolPageShell>
  );
}
