import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "JPG to PNG Converter",
  description: "Convert a JPG to a lossless PNG in your browser for editing or PNG-only tools. No quality gain, no upload — the file stays on your device.",
  alternates: { canonical: "/jpg-to-png" },
};

export default function JpgToPngPage() {
  return (
    <ToolPageShell
      title="JPG to PNG"
      description="Make a lossless PNG copy of a JPG image."
      note="Local browser processing"
      slug="/jpg-to-png"
      steps={["Choose a JPG photo.", "Convert to PNG.", "Download the PNG file."]}
      explainer={
        <>
          <h2 id="learn-title">What JPG to PNG does — and does not do</h2>
          <p>
            The most important thing to know up front: converting a JPG to PNG does not improve quality. JPG
            is a lossy format, meaning detail was permanently discarded the moment the file was first saved.
            PNG is lossless, but lossless only means it faithfully stores whatever you give it — including the
            compression artifacts already baked into the JPG. Going from JPG to PNG preserves the current
            image exactly; it cannot bring back what the JPG threw away.
          </p>
          <p>
            Expect the file to get <em>larger</em>, often much larger. PNG records every pixel without lossy
            compression, and photographs are full of fine variation, so a small JPG can turn into a PNG
            several times its size. That is normal and not a sign anything went wrong.
          </p>

          <h3>So when is it actually useful?</h3>
          <ul>
            <li>
              <strong>A tool or upload form demands PNG.</strong> Some editors, design apps, and platforms
              accept PNG only. Converting gets your image through the door.
            </li>
            <li>
              <strong>You are about to edit and re-save repeatedly.</strong> Every JPG save loses a little
              more. Working in PNG between edits keeps each save lossless, so the image does not degrade
              step by step. Export back to JPG once at the end.
            </li>
            <li>
              <strong>You need to add transparency.</strong> JPG cannot store transparent pixels; PNG can. If
              you plan to knock out a background, you need a PNG to hold the result.
            </li>
          </ul>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Type</th><th>Transparency</th><th>Typical size for a photo</th></tr>
            </thead>
            <tbody>
              <tr><th>JPG</th><td>Lossy</td><td>No</td><td>Small</td></tr>
              <tr><th>PNG</th><td>Lossless</td><td>Yes</td><td>Larger, often much larger</td></tr>
              <tr><th>WebP</th><td>Lossy or lossless</td><td>Yes</td><td>Small to moderate</td></tr>
            </tbody>
          </table>

          <h3>If it is only about compatibility</h3>
          <p>
            Plenty of tools that reject JPG also accept WebP, which stays far smaller than PNG and still
            supports transparency and lossless mode — see the{" "}
            <Link href="/guides/webp-vs-png">WebP vs PNG guide</Link> and the{" "}
            <Link href="/jpg-to-webp">JPG to WebP</Link> converter. And if you converted to PNG but really
            wanted a smaller photo, you likely want the opposite direction:{" "}
            <Link href="/png-to-jpg">PNG to JPG</Link> or the{" "}
            <Link href="/image-compressor">image compressor</Link>. Whichever way you go, the file is
            processed inside this browser tab and never uploaded.
          </p>
        </>
      }
      faqs={[
        { question: "Does JPG to PNG improve quality?", answer: "No. PNG is lossless but cannot restore detail the JPG already discarded. It preserves the current image, including any existing artifacts. Convert for editing or PNG-only tools, not to recover lost quality." },
        { question: "Will the PNG be larger than the JPG?", answer: "Usually yes, often much larger. PNG stores every pixel without lossy compression, so a photograph typically becomes several times the size of the original JPG. That is expected." },
        { question: "When should I convert JPG to PNG?", answer: "When a tool or upload form only accepts PNG, when you will edit and re-save repeatedly and want lossless intermediate saves, or when you need to add transparency, which JPG cannot store." },
        { question: "Can I add a transparent background after converting?", answer: "Converting to PNG gives you a format that can hold transparency, but it does not remove the background by itself. The whole image is opaque until you erase parts of it in an editor." },
        { question: "Is PNG or WebP the better target?", answer: "If you only need compatibility, WebP stays much smaller than PNG and still supports transparency and lossless mode. Choose PNG when a specific tool requires it or when maximum compatibility matters more than size." },
        { question: "Is my photo uploaded?", answer: "No. The conversion happens in your browser using the Canvas API, so the file stays on your device and the tool works offline." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/png" accept="image/jpeg,.jpg,.jpeg" />
    </ToolPageShell>
  );
}
