import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "HEIC to WebP Converter",
  description: "Convert an iPhone HEIC or HEIF photo to a small, web-ready WebP in your browser. No upload, no account — the photo stays on your device.",
  alternates: { canonical: "/heic-to-webp" },
};

export default function HeicToWebpPage() {
  return (
    <ToolPageShell
      title="HEIC to WebP"
      description="Turn an iPhone photo into a small web-ready WebP."
      note="No server upload"
      slug="/heic-to-webp"
      steps={["Choose a HEIC or HEIF photo.", "Set the WebP quality.", "Convert and download the WebP."]}
      explainer={
        <>
          <h2 id="learn-title">The smallest web-ready copy of an iPhone photo</h2>
          <p>
            HEIC (also written HEIF) is what iPhones and iPads save by default. It is compact, but it
            is an Apple-centric format — plenty of websites, apps, and upload forms cannot read it. If
            the photo is headed for a web page, WebP is the natural target: it was designed for the web
            and, like HEIC, uses modern compression to keep files small. This is usually the leanest
            way to get an iPhone photo onto a site.
          </p>
          <p>
            Both formats are efficient, so a WebP copy stays close to HEIC in size while working
            everywhere a browser does. Both are lossy: they save space by dropping detail your eye is
            least likely to notice. When you pick a file here, the HEIC photo is decoded and re-encoded
            as WebP entirely inside this browser tab — nothing is uploaded, so it works offline and the
            photo never leaves your device.
          </p>

          <h3>Setting the quality</h3>
          <p>
            The quality control decides how much detail to keep. Around the 82% default is a good start
            for photos — clearly smaller with little visible loss. Nudge it down while watching the
            result and stop when you can see softening; raise it if you want to hold more detail. Bear
            in mind the photo is decoded from HEIC before being saved as WebP, so pushing the quality
            very low compounds the compression. The{" "}
            <Link href="/guides/image-compression-quality">quality guide</Link> walks through where to
            land.
          </p>

          <h3>WebP or JPG?</h3>
          <p>
            WebP gives the smaller file and is read by every current browser, so it is the better pick
            for the web. Choose <Link href="/heic-to-jpg">HEIC to JPG</Link> instead when the
            destination is an older app or form that might not accept WebP yet — JPG opens essentially
            everywhere. If you need a lossless copy for editing rather than a small web file, use{" "}
            <Link href="/heic-to-png">HEIC to PNG</Link>. See{" "}
            <Link href="/guides/heic-explained">HEIC explained</Link> for background on the format.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Type</th><th>Transparency</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><th>HEIC</th><td>Lossy, high efficiency</td><td>Yes</td><td>Saving space on Apple devices</td></tr>
              <tr><th>WebP</th><td>Lossy or lossless</td><td>Yes</td><td>Smallest web-ready copy</td></tr>
              <tr><th>JPG</th><td>Lossy</td><td>No</td><td>Maximum compatibility</td></tr>
              <tr><th>PNG</th><td>Lossless</td><td>Yes</td><td>Editing copies and transparency</td></tr>
            </tbody>
          </table>

          <p>
            Already have a JPG or PNG rather than a HEIC? Use{" "}
            <Link href="/jpg-to-webp">JPG to WebP</Link> or{" "}
            <Link href="/png-to-webp">PNG to WebP</Link> instead.
          </p>
        </>
      }
      faqs={[
        { question: "Why convert HEIC to WebP?", answer: "WebP keeps files small while being supported by every current browser, so it is a strong choice when an iPhone photo is headed for a website. HEIC itself is not widely readable outside Apple's apps." },
        { question: "Does WebP keep quality?", answer: "At a matched setting WebP stays visually clean while being small. Raise the quality control toward the top if you want to preserve more detail, or lower it for a smaller file." },
        { question: "How does the conversion work?", answer: "The HEIC photo is decoded and then re-encoded as WebP, all inside your browser. Because there is a decode step first, keeping the quality reasonably high avoids stacking extra compression on the result." },
        { question: "Should I use WebP or JPG for my iPhone photo?", answer: "WebP is smaller and ideal for the web. Pick JPG if the destination is an older app or upload form that might not read WebP — JPG opens almost everywhere." },
        { question: "Is my photo processed on a server?", answer: "No. The HEIC photo is decoded and converted in your browser using the Canvas API, so it never leaves your device and the tool works offline." },
        { question: "Can I convert several photos at once?", answer: "The tool works on one photo at a time. Convert the first, then load the next — each stays on your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/webp" accept="image/heic,image/heif,.heic,.heif" />
    </ToolPageShell>
  );
}
