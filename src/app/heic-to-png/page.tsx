import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "HEIC to PNG Converter",
  description: "Convert an iPhone HEIC or HEIF photo to a lossless PNG in your browser. No upload, no account — the photo stays on your device.",
  alternates: { canonical: "/heic-to-png" },
};

export default function HeicToPngPage() {
  return (
    <ToolPageShell
      title="HEIC to PNG"
      description="Turn an iPhone photo into a lossless PNG."
      note="The photo stays on your device"
      slug="/heic-to-png"
      steps={["Choose a HEIC or HEIF photo.", "Convert to PNG.", "Download the PNG file."]}
      explainer={
        <>
          <h2 id="learn-title">HEIC to PNG: when it&apos;s the right move</h2>
          <p>
            HEIC (also written HEIF) is the high-efficiency format iPhones and iPads have saved by
            default since iOS 11. It keeps photos small but is awkward outside Apple&apos;s apps, so
            converting is often the fastest way to open one elsewhere. PNG is one option — but for a
            plain phone photo it is usually not the one you want, and it helps to know why before you
            pick it.
          </p>
          <p>
            PNG is a lossless format. That means the copy you get never picks up new compression
            artifacts and will not degrade as you edit and re-save it, and it can carry transparency.
            That makes PNG great for a working copy you plan to edit, or for a photo you need to place
            on a transparent background. The cost is size: because it throws nothing away, a PNG of a
            full-resolution photo is typically much larger than the HEIC it came from — often several
            times the size.
          </p>

          <h3>You probably want JPG instead</h3>
          <p>
            For simply sharing, uploading, or viewing an iPhone photo, <Link href="/heic-to-jpg">HEIC
            to JPG</Link> is the better default: a JPG opens everywhere and stays small. Reach for PNG
            only when you specifically need lossless quality or transparency. If the destination is a
            website and you want the smallest file, <Link href="/heic-to-webp">HEIC to WebP</Link> is
            the one to use. The <Link href="/guides/heic-explained">HEIC explained</Link> guide covers
            the format in more depth.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Type</th><th>Transparency</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><th>HEIC</th><td>Lossy, high efficiency</td><td>Yes</td><td>Saving space on Apple devices</td></tr>
              <tr><th>PNG</th><td>Lossless</td><td>Yes</td><td>Editing copies and transparency</td></tr>
              <tr><th>JPG</th><td>Lossy</td><td>No</td><td>Sharing photos anywhere</td></tr>
              <tr><th>WebP</th><td>Lossy or lossless</td><td>Yes</td><td>Smallest web-ready copy</td></tr>
            </tbody>
          </table>

          <h3>How it works here</h3>
          <p>
            When you choose a file, the HEIC photo is decoded and re-saved as a PNG entirely inside
            this browser tab. Nothing is uploaded, so the tool works offline and your photo never
            leaves your device. If the resulting PNG is bigger than you need, run it through the{" "}
            <Link href="/image-compressor">image compressor</Link> or switch to a JPG or WebP copy
            instead — see <Link href="/guides/webp-vs-png">WebP vs PNG</Link> for how those compare.
          </p>
        </>
      }
      faqs={[
        { question: "When should I pick PNG over JPG for a HEIC file?", answer: "Choose PNG when you want a lossless working copy that will not degrade as you edit and re-save it, or when you need transparency. For simply sharing or uploading a photo, HEIC to JPG is usually the better choice." },
        { question: "Will the PNG be large?", answer: "Likely yes. PNG is lossless, so a converted full-resolution photo is often several times the size of the original HEIC. Compress it afterward, or use JPG or WebP, if file size matters." },
        { question: "Is a PNG really lossless if HEIC was compressed?", answer: "PNG itself adds no further loss and will not degrade on re-saving, which is its advantage for editing. It cannot rebuild detail the HEIC already compressed away, but it locks in the current quality without introducing new artifacts." },
        { question: "Does PNG keep transparency?", answer: "Yes. PNG supports an alpha channel, so if a photo has transparent areas they are preserved — one of the main reasons to choose PNG over JPG." },
        { question: "Is my photo uploaded?", answer: "No. The HEIC photo is decoded and converted inside your browser, so it never leaves your device and the tool works offline." },
        { question: "Can I convert several photos at once?", answer: "The tool works on one photo at a time. Convert the first, then load the next — each stays on your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/png" accept="image/heic,image/heif,.heic,.heif" />
    </ToolPageShell>
  );
}
