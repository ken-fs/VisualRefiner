import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "JPG to WebP Converter",
  description: "Convert JPG to WebP in your browser for smaller photos at similar quality. No upload, no account — the photo stays on your device.",
  alternates: { canonical: "/jpg-to-webp" },
};

export default function JpgToWebpPage() {
  return (
    <ToolPageShell
      title="JPG to WebP"
      description="Make a web-friendly copy of a JPG photo."
      note="No server upload"
      slug="/jpg-to-webp"
      steps={["Choose a JPG photo.", "Set the WebP quality.", "Convert and download the WebP file."]}
      explainer={
        <>
          <h2 id="learn-title">JPG to WebP, and why it&apos;s worth it</h2>
          <p>
            JPG has been the standard for photographs for decades, and it still works everywhere. But
            its compression is old, and WebP simply does the same job more efficiently: at a matched
            visual quality a WebP photo is usually smaller than the JPG it came from. On a website that
            means faster loading and less bandwidth, which is the main reason to convert.
          </p>
          <p>
            Both formats are lossy — they save space by discarding detail your eye is least likely to
            miss. The difference is that WebP&apos;s encoder tends to get more out of each byte, so you
            keep similar-looking results in a lighter file. When you pick a JPG here, it is decoded and
            re-encoded as WebP inside this browser tab. Nothing is uploaded, so the photo stays on your
            device and the tool works offline.
          </p>

          <h3>About re-encoding a JPG</h3>
          <p>
            Your JPG has already been compressed once. Converting it to WebP compresses it a second
            time, so keep the quality reasonably high — around the 82% default is a good start — to
            avoid stacking visible artifacts on top of the ones already baked in. Going from a JPG to
            WebP will not <em>add</em> detail; at best it holds the current look at a smaller size. If
            you still have the original photo before it became a JPG, converting that gives the
            cleanest result. The <Link href="/guides/image-compression-quality">quality guide</Link>{" "}
            explains where to set the slider.
          </p>

          <h3>When JPG is still the safer pick</h3>
          <p>
            WebP is read by every current browser, but a few older apps, email clients, and upload
            forms still choke on it. If the destination might be one of those, keep the JPG or use{" "}
            <Link href="/webp-to-jpg">WebP to JPG</Link> to convert back. For a straight photo with no
            transparency, JPG remains a perfectly good, universally accepted format.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Type</th><th>Transparency</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><th>JPG</th><td>Lossy</td><td>No</td><td>Photos that need to open anywhere</td></tr>
              <tr><th>WebP</th><td>Lossy or lossless</td><td>Yes</td><td>Smaller photos on the web</td></tr>
              <tr><th>PNG</th><td>Lossless</td><td>Yes</td><td>Graphics and screenshots, not photos</td></tr>
            </tbody>
          </table>

          <p>
            If your goal is purely a smaller file rather than a format change, the{" "}
            <Link href="/image-compressor">image compressor</Link> lets you dial in the size directly.
            Coming from a PNG graphic instead? Use <Link href="/png-to-webp">PNG to WebP</Link>, which
            keeps transparency. For the bigger picture, see{" "}
            <Link href="/guides/webp-vs-png">WebP vs PNG</Link>.
          </p>
        </>
      }
      faqs={[
        { question: "Why convert JPG to WebP?", answer: "WebP usually produces a smaller file than JPG at the same visible quality, which means faster page loads and less bandwidth. It is supported by every current browser." },
        { question: "Is WebP lower quality than JPG?", answer: "At a matched setting WebP typically looks the same or better while being smaller. Raise the quality control if you want to keep more detail in the converted file." },
        { question: "Does converting a JPG twice hurt quality?", answer: "A JPG is already compressed once, and converting to WebP compresses it again. Keeping the quality high, near the 82% default, avoids adding noticeable artifacts on top of the original ones." },
        { question: "Will WebP make my photo look sharper than the JPG?", answer: "No. Converting cannot restore detail the JPG already discarded. It holds the current look at a smaller size — for the cleanest result, convert from the original photo if you still have it." },
        { question: "Does the JPG leave my device?", answer: "No. The conversion runs in your browser using the Canvas API, and the original JPG is never uploaded to a server." },
        { question: "Can I convert more than one photo at a time?", answer: "The tool works on one photo at a time. Convert the first, then load the next — each stays on your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/webp" accept="image/jpeg,.jpg,.jpeg" />
    </ToolPageShell>
  );
}
