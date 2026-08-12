import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Image Compressor",
  description: "Compress JPG and WebP images in your browser with a simple quality control. No upload, no account — the file stays on your device.",
  alternates: { canonical: "/image-compressor" },
};

export default function ImageCompressorPage() {
  return (
    <ToolPageShell
      title="Image compressor"
      description="Reduce file size without sending the image away."
      note="No upload required"
      slug="/image-compressor"
      steps={["Choose an image from your device.", "Adjust the quality percentage.", "Compare the size and download the result."]}
      explainer={
        <>
          <h2 id="learn-title">What compressing actually does</h2>
          <p>
            Compressing re-saves your image at a lower quality setting so the file takes less space. For
            photos — JPG and WebP — this is <em>lossy</em>: the encoder drops the detail your eye is least
            likely to miss. You trade a little fidelity for a much smaller file, and for most photos the
            loss stays invisible until you push the quality down hard.
          </p>
          <p>
            The quality slider is simply how much detail to keep. Higher stays closer to the original and
            larger; lower gets smaller but eventually shows soft edges and blocky patches. Around 82% is a
            good starting point for photos — clearly smaller with little visible loss. Nudge it down while
            watching the result, and stop when you can see the difference. The{" "}
            <Link href="/guides/image-compression-quality">quality guide</Link> walks through where to set it.
          </p>

          <h3>JPG or WebP?</h3>
          <p>
            WebP usually reaches a smaller file than JPG at the same visible quality, and it handles
            transparency, so it is the default here. Switch to JPG when the place you are sending the image
            might not read WebP yet.
          </p>

          <h3>When compressing is the wrong tool</h3>
          <ul>
            <li>
              <strong>Screenshots, logos, and flat graphics</strong> have sharp edges that lossy
              compression smears. Those are usually smaller and cleaner as PNG — use the{" "}
              <Link href="/image-converter">image converter</Link> instead.
            </li>
            <li>
              <strong>Already-small or already-compressed images</strong> have little left to remove;
              squeezing again mostly adds artifacts for almost no saving.
            </li>
            <li>
              <strong>Oversized dimensions</strong> often waste more space than quality does. A
              4000-pixel-wide photo shown at 800 pixels can be{" "}
              <Link href="/image-resizer">resized</Link> first — that alone shrinks the file a lot.
            </li>
          </ul>

          <table className="compare-table">
            <thead>
              <tr><th>What you have</th><th>Best format</th><th>Where to start</th></tr>
            </thead>
            <tbody>
              <tr><th>A photo to share</th><td>JPG or WebP</td><td>~82% quality</td></tr>
              <tr><th>A photo for the web</th><td>WebP</td><td>~82% quality</td></tr>
              <tr><th>A screenshot or UI capture</th><td>PNG (convert, don&apos;t compress)</td><td>Lossless</td></tr>
              <tr><th>A logo or flat graphic</th><td>PNG or WebP</td><td>Lossless / high</td></tr>
            </tbody>
          </table>

          <p>
            One thing to remember: compression only goes one way. Detail you remove cannot be restored by
            saving again at a higher number, so keep your original if you might need it later.
          </p>
        </>
      }
      faqs={[
        { question: "Does compressing reduce image quality?", answer: "Lossy formats like JPG and WebP trade some detail for a smaller file. Starting near 82% quality keeps photos looking clean while cutting most of the size. Lower the quality only until you can see the difference." },
        { question: "What quality should I choose?", answer: "Start around 82% and lower it while watching the preview, stopping when you notice softening. Photos tolerate more compression than graphics with sharp edges, which stay cleaner at higher settings." },
        { question: "Are my images uploaded anywhere?", answer: "No. Compression runs in your browser using the Canvas API, and the file is never sent to a server. Closing the tab clears the working session." },
        { question: "Which format gives the smallest file?", answer: "WebP is usually smaller than JPG at the same visible quality, so this tool defaults to WebP. Use the JPG option if you need the widest possible compatibility." },
        { question: "Why did my file barely get smaller?", answer: "It is probably already compressed, or it is a flat graphic without much detail to remove. Resizing the dimensions, or keeping a screenshot as PNG, usually helps more than compressing again." },
        { question: "Can I compress a PNG?", answer: "This tool compresses to JPG or WebP, which suit photographs. A screenshot or logo is usually better kept as PNG; convert it with the image converter if you want a smaller WebP copy." },
      ]}
    >
      <ImageWorkspace mode="compress" defaultFormat="image/webp" />
    </ToolPageShell>
  );
}
