import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Image Converter",
  description: "Convert images between JPG, PNG, and WebP in your browser, and open iPhone HEIC photos too. No upload, no account — files stay on your device.",
  alternates: { canonical: "/image-converter" },
};

export default function ImageConverterPage() {
  return (
    <ToolPageShell
      title="Image converter"
      description="Change the format. Keep the file on your device."
      note="Local browser processing"
      slug="/image-converter"
      steps={["Choose a JPG, PNG, WebP, or HEIC file.", "Pick the output format and quality.", "Convert it and download the new file."]}
      explainer={
        <>
          <h2 id="learn-title">Picking the right format</h2>
          <p>
            Converting an image means re-saving the same picture in a different format. The pixels you see
            do not change — what changes is how they are stored, and that decides file size, whether
            transparency survives, and which apps can open the result. This tool reads JPG, PNG, and WebP,
            and it also opens HEIC and HEIF photos from an iPhone, then writes back out as JPG, PNG, or WebP.
          </p>

          <h3>Lossy or lossless</h3>
          <p>
            The first thing to know about any format is whether it throws detail away. JPG and WebP are
            <em> lossy</em>: the encoder discards information your eye is least likely to notice, which is
            how they stay small. PNG is <em>lossless</em>: every pixel is kept exactly, so a screenshot or
            line-art export stays crisp with no smearing around edges and text. WebP can work either way,
            lossy for photos or lossless for graphics.
          </p>

          <h3>Transparency and compatibility</h3>
          <p>
            PNG and WebP can store transparent areas; JPG cannot. Convert a transparent PNG to JPG and every
            see-through pixel is filled with a solid background — usually white. That is the one conversion
            worth pausing on, because it cannot be undone by converting back. On compatibility, JPG and PNG
            open essentially everywhere, WebP is supported across current browsers and most modern software
            though a few older tools still choke on it. The <Link href="/guides/webp-vs-png">WebP vs PNG guide</Link>{" "}
            goes deeper on that trade-off.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Type</th><th>Transparency</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><th>JPG</th><td>Lossy</td><td>No</td><td>Photos you share or upload anywhere</td></tr>
              <tr><th>PNG</th><td>Lossless</td><td>Yes</td><td>Screenshots, logos, sharp graphics</td></tr>
              <tr><th>WebP</th><td>Lossy or lossless</td><td>Yes</td><td>Smaller images for the web</td></tr>
              <tr><th>HEIC</th><td>Lossy, high efficiency</td><td>Yes</td><td>Saving space on Apple devices (input only)</td></tr>
            </tbody>
          </table>

          <h3>Which way should you convert?</h3>
          <ul>
            <li>
              <strong>PNG to JPG</strong> — for a photo saved as PNG that is far larger than it needs to be.
              Try <Link href="/png-to-jpg">PNG to JPG</Link>.
            </li>
            <li>
              <strong>JPG to PNG</strong> — when a tool insists on PNG, though it will not restore detail JPG
              already dropped. See <Link href="/jpg-to-png">JPG to PNG</Link>.
            </li>
            <li>
              <strong>Anything to WebP</strong> — to shrink images for a website while keeping transparency.
              Use <Link href="/png-to-webp">PNG to WebP</Link> or <Link href="/jpg-to-webp">JPG to WebP</Link>.
            </li>
            <li>
              <strong>iPhone photos</strong> — turn a HEIC into something universal with{" "}
              <Link href="/heic-to-jpg">HEIC to JPG</Link>.
            </li>
          </ul>

          <p>
            One file is converted at a time, and it happens entirely inside this browser tab, so nothing is
            uploaded. If the goal is a smaller file rather than a different format, the{" "}
            <Link href="/image-compressor">image compressor</Link> gives you a quality control, and resizing
            the dimensions with the <Link href="/image-resizer">image resizer</Link> often saves even more.
          </p>
          <p>
            Re-saving through this converter also drops the photo&apos;s hidden EXIF and GPS metadata, so the
            output is clean by default. If you only want to strip that data and keep the same format, the{" "}
            <Link href="/remove-metadata">metadata remover</Link> reads what a photo carries and writes a clean
            copy, all in your browser.
          </p>
        </>
      }
      faqs={[
        { question: "Which formats can I convert between?", answer: "You can convert JPG, PNG, and WebP freely, and bring in HEIC or HEIF photos from an iPhone. Pick the output format that fits where the image will be used." },
        { question: "Will converting to JPG lose transparency?", answer: "Yes. JPG has no transparency, so transparent areas become a solid background. Keep PNG or WebP if you need to preserve transparency." },
        { question: "Does converting JPG to PNG improve the quality?", answer: "No. PNG stores every pixel exactly, but it cannot recover detail a lossy JPG already discarded. The PNG just preserves the JPG as it is, usually in a larger file." },
        { question: "What is the difference between lossy and lossless formats?", answer: "Lossy formats like JPG and WebP drop some detail to stay small, which suits photos. Lossless PNG keeps every pixel, which suits screenshots, logos, and sharp text." },
        { question: "Can I convert several images at once?", answer: "The converter works on one image at a time. Convert the first, then load the next — each stays on your device." },
        { question: "Is anything uploaded to a server?", answer: "No. The conversion happens entirely in your browser, so the original file stays on your device and the tool works offline." },
      ]}
    >
      <ImageWorkspace mode="convert" />
    </ToolPageShell>
  );
}
