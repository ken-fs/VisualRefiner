import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "WebP to JPG Converter",
  description: "Convert a WebP to JPG in your browser so it opens in any app or upload form. Flattens transparency, no upload — the file stays on your device.",
  alternates: { canonical: "/webp-to-jpg" },
};

export default function WebpToJpgPage() {
  return (
    <ToolPageShell
      title="WebP to JPG"
      description="Turn a WebP into a widely supported JPG."
      note="Local browser processing"
      slug="/webp-to-jpg"
      steps={["Choose a WebP image.", "Set the JPG quality.", "Convert and download the JPG."]}
      explainer={
        <>
          <h2 id="learn-title">Why you would convert WebP to JPG</h2>
          <p>
            WebP is a modern format that Google built for the web. It usually makes smaller files than JPG at
            the same visible quality, which is exactly why so many sites now serve images as WebP — and why
            you end up with one when you save a picture from a web page. The problem is what happens next.
            Older photo editors, some office and design software, older phones, and plenty of upload forms
            still do not recognize WebP and simply refuse it.
          </p>
          <p>
            JPG is the universal fallback. It has been around for decades and opens in essentially everything,
            so converting a WebP to JPG is the quickest way to make a stubborn file cooperate. You are trading
            WebP&apos;s smaller size for compatibility that just works.
          </p>

          <h3>What to keep in mind</h3>
          <ul>
            <li>
              <strong>Transparency is dropped.</strong> WebP can store transparent pixels; JPG cannot. Any
              see-through area is flattened onto a solid background during conversion. If you need to keep
              transparency, convert to <Link href="/webp-to-png">PNG instead</Link>.
            </li>
            <li>
              <strong>You are re-encoding, not upgrading.</strong> Both formats are lossy for photos, so
              converting re-saves the image and drops a little more detail. Doing it once at a reasonable
              quality keeps the change hard to notice.
            </li>
            <li>
              <strong>The JPG may be larger.</strong> Because WebP compresses harder, the JPG can come out
              bigger than the WebP it started as. That is the cost of broad compatibility.
            </li>
          </ul>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Type</th><th>Transparency</th><th>Opens everywhere?</th></tr>
            </thead>
            <tbody>
              <tr><th>WebP</th><td>Lossy or lossless</td><td>Yes</td><td>Modern apps and browsers</td></tr>
              <tr><th>JPG</th><td>Lossy</td><td>No</td><td>Yes — the safe default</td></tr>
              <tr><th>PNG</th><td>Lossless</td><td>Yes</td><td>Yes, but larger files</td></tr>
            </tbody>
          </table>

          <h3>Setting the quality</h3>
          <p>
            The quality slider decides how much detail the JPG keeps. Higher stays closer to the original and
            larger; lower gets smaller but eventually shows soft edges and blocky patches. Around 82% is a
            good starting point for a photo — clearly smaller with little visible loss. The{" "}
            <Link href="/guides/image-compression-quality">quality guide</Link> goes into more detail. Prefer
            to keep WebP but shrink it? The <Link href="/image-compressor">image compressor</Link> handles
            that. Everything runs inside this browser tab, so your image is never uploaded.
          </p>
        </>
      }
      faqs={[
        { question: "Why convert WebP to JPG?", answer: "JPG is accepted by virtually every app, editor, and upload form. WebP is newer and some older software refuses it, so if a tool will not open your WebP, converting to JPG fixes it." },
        { question: "What happens to transparency?", answer: "JPG cannot store transparency, so any transparent areas are flattened onto a solid background during conversion. Convert to PNG instead if you need to keep transparency." },
        { question: "Does converting WebP to JPG reduce quality?", answer: "Both are lossy for photos, so re-saving drops a little more detail. Converting once at a reasonable quality, near the default, keeps the change hard to notice." },
        { question: "Will the JPG be smaller than the WebP?", answer: "Not necessarily. WebP usually compresses harder than JPG, so the converted JPG can actually be larger. You are converting for compatibility, not to save space." },
        { question: "Why does my phone or app show WebP as unsupported?", answer: "WebP support arrived later than JPG, so some older devices, editors, and upload forms do not recognize it. Converting to JPG produces a file those tools can open." },
        { question: "Is anything uploaded?", answer: "No. The WebP is decoded and converted in your browser using the Canvas API, so it is never sent to a server and the tool works offline." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/jpeg" accept="image/webp,.webp" />
    </ToolPageShell>
  );
}
