import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "PNG to AVIF Converter",
  description: "Convert PNG to AVIF in your browser and keep transparency. Dramatically smaller files for the web — no upload, the image stays on your device.",
  alternates: { canonical: "/png-to-avif" },
};

export default function PngToAvifPage() {
  return (
    <ToolPageShell
      title="PNG to AVIF"
      description="Shrink a PNG to a fraction of its size, keep transparency."
      note="Processed in this tab"
      slug="/png-to-avif"
      steps={["Choose a PNG image.", "Set the AVIF quality.", "Convert and download the AVIF file."]}
      explainer={
        <>
          <h2 id="learn-title">Why move a PNG to AVIF</h2>
          <p>
            PNG earns its keep with lossless pixels and transparency — but it charges for it. A photo
            or detailed graphic saved as PNG is often the heaviest asset on a page. AVIF was designed
            for exactly this rescue: at a high quality setting it looks identical to the source while
            routinely cutting the file to a tenth of the PNG, and it keeps the alpha channel that
            JPG would throw away.
          </p>
          <p>
            The conversion runs in this browser tab. Your PNG is decoded locally and re-encoded as
            AVIF with a WebAssembly build of libavif — the same codec engine behind the big converter
            sites, except nothing is uploaded and it works offline.
          </p>

          <h3>How much smaller?</h3>
          <p>
            Photos and gradient-rich graphics see the biggest wins — PNGs of a few hundred KB often
            come out the other side at tens of KB. Flat logos with a handful of colors are already
            efficient as PNG, so the gain there is smaller. The only way to know for your image is to
            run it through and compare.
          </p>

          <h3>Will everything open the AVIF?</h3>
          <p>
            Every current browser reads AVIF (Chrome, Firefox, Safari 16.4+, Edge), which makes it a
            safe choice for websites. Some older desktop software and upload forms still cannot — keep
            the PNG master, and if you hit a wall, <Link href="/avif-to-png">convert back to PNG</Link>{" "}
            or use <Link href="/png-to-webp">PNG to WebP</Link> for slightly wider support. More detail
            in <Link href="/guides/avif-vs-webp">AVIF vs WebP</Link>.
          </p>
        </>
      }
      faqs={[
        { question: "Does AVIF keep PNG transparency?", answer: "Yes. AVIF supports a full alpha channel, so transparent and semi-transparent areas of the PNG survive the conversion." },
        { question: "How much smaller will the AVIF be?", answer: "It depends on the image. Photos and detailed, colorful graphics often shrink by 80–90% compared with PNG. Simple flat logos are already compact as PNG, so the reduction there is more modest." },
        { question: "Is the AVIF lossless like the PNG?", answer: "This tool re-encodes at the quality you set, so it is lossy. Near the top of the quality slider the result is visually indistinguishable from the original PNG while being far smaller." },
        { question: "What quality should I choose?", answer: "The 82% default works well for most images. Raise it toward 90%+ for screenshots, text, and line art where crisp edges matter." },
        { question: "Is the PNG uploaded anywhere?", answer: "No. The image is decoded and encoded locally in your browser with a WebAssembly codec — it never leaves your device and the tool works offline." },
        { question: "Can I convert several PNGs at once?", answer: "The tool handles one image at a time. Convert the first, then load the next — each stays on your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/avif" accept="image/png,.png" />
    </ToolPageShell>
  );
}
