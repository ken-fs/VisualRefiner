import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter",
  description: "Convert an iPhone HEIC or HEIF photo to JPG in your browser. No upload, no account — the photo stays on your device.",
  alternates: { canonical: "/heic-to-jpg" },
};

export default function HeicToJpgPage() {
  return (
    <ToolPageShell
      title="HEIC to JPG"
      description="Open an iPhone photo almost anywhere."
      note="The photo stays on your device"
      slug="/heic-to-jpg"
      steps={["Choose a HEIC or HEIF photo.", "Set the JPG quality.", "Convert and download the JPG."]}
      explainer={
        <>
          <h2 id="learn-title">HEIC and JPG, briefly</h2>
          <p>
            HEIC (you will also see it written HEIF) is the photo format iPhones and iPads have saved by
            default since iOS 11 in 2017. It uses newer compression — the same family as HEVC video — to
            keep a photo at close to JPG quality in a noticeably smaller file. Apple&apos;s reason for the
            switch was storage.
          </p>
          <p>
            The catch is support. Outside Apple&apos;s own apps it is hit-and-miss: Windows only previews
            HEIC once you install a codec from the Microsoft Store, plenty of sites reject it on upload, and
            older editors just show an error. JPG has none of those problems — it opens on essentially
            everything, which is why converting is usually the fastest fix.
          </p>
          <p>
            When you pick a file here, it is decoded and re-saved as a JPG inside this browser tab. The
            photo is not uploaded, so the tool works offline and your images stay on your device.
          </p>

          <h3>JPG, PNG, or WebP?</h3>
          <p>Which output you want depends on where the photo is going:</p>
          <ul>
            <li><strong>JPG</strong> — the safe default for a photo you want to share, upload, or open anywhere.</li>
            <li>
              <strong>PNG</strong> — only worth it when you need a lossless copy or transparency, which is
              rare for a phone photo and produces a much larger file. Use{" "}
              <Link href="/heic-to-png">HEIC to PNG</Link> for that.
            </li>
            <li>
              <strong>WebP</strong> — a smaller file than JPG at similar quality, best when the destination
              is the web. Support is broad now, though a few older tools still cannot read it. Try{" "}
              <Link href="/heic-to-webp">HEIC to WebP</Link>.
            </li>
          </ul>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Type</th><th>Transparency</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><th>HEIC</th><td>Lossy, high efficiency</td><td>Yes</td><td>Saving space on Apple devices</td></tr>
              <tr><th>JPG</th><td>Lossy</td><td>No</td><td>Sharing photos anywhere</td></tr>
              <tr><th>PNG</th><td>Lossless</td><td>Yes</td><td>Graphics, screenshots, transparency</td></tr>
              <tr><th>WebP</th><td>Lossy or lossless</td><td>Yes</td><td>Smaller images for the web</td></tr>
            </tbody>
          </table>

          <h3>Keeping quality and size sensible</h3>
          <p>
            JPG is lossy, so saving one drops a little detail. Converting once from the HEIC original is
            fine — at high quality the difference is hard to see. What you want to avoid is re-saving the
            same JPG over and over.
          </p>
          <p>
            A converted JPG can actually be larger than the HEIC it came from, because HEIC compresses
            harder. If size matters, run the result through the{" "}
            <Link href="/image-compressor">image compressor</Link>, or convert to WebP instead.
          </p>
        </>
      }
      faqs={[
        { question: "What is a HEIC file?", answer: "HEIC is the high-efficiency image format iPhones use by default. It stores a photo at good quality in a small file, but many apps and websites cannot open it, which is why converting to JPG helps." },
        { question: "Why won't my HEIC file open on Windows?", answer: "Windows can only preview HEIC after you install the HEIF Image Extensions codec from the Microsoft Store, and many apps do not support it at all. Converting to JPG means you no longer need the codec." },
        { question: "Is HEIC the same as HEIF?", answer: "In practice, yes. HEIF is the container format; HEIC is the name for HEIF files that use HEVC compression, which is what iPhones save. You may see either a .heic or .heif extension." },
        { question: "Do I lose quality converting HEIC to JPG?", answer: "JPG is a lossy format, so there is a small quality trade-off. Keeping the quality near the default preserves detail while producing a widely compatible file." },
        { question: "Is my photo uploaded to convert it?", answer: "No. The HEIC photo is decoded and converted inside your browser, so it never leaves your device." },
        { question: "Can I convert several photos at once?", answer: "The tool works on one photo at a time. Convert the first, then load the next — each stays on your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/jpeg" accept="image/heic,image/heif,.heic,.heif" />
    </ToolPageShell>
  );
}
