import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "WebP to AVIF Converter",
  description: "Convert WebP to AVIF in your browser for even smaller files. Keeps transparency, no upload — the image is re-encoded on your device.",
  alternates: { canonical: "/webp-to-avif" },
};

export default function WebpToAvifPage() {
  return (
    <ToolPageShell
      title="WebP to AVIF"
      description="Squeeze a web-ready image down one more notch."
      note="Processed in this tab"
      slug="/webp-to-avif"
      steps={["Choose a WebP image.", "Set the AVIF quality.", "Convert and download the AVIF file."]}
      explainer={
        <>
          <h2 id="learn-title">Why convert WebP to AVIF</h2>
          <p>
            WebP was a big step up from JPG and PNG; AVIF is the step after that. Built on the AV1
            video codec, it typically takes another 20–50% off a WebP at the same visual quality,
            while keeping full transparency support. When bandwidth or storage budget matters — a
            image-heavy site, a large asset library — that extra squeeze adds up fast.
          </p>
          <p>
            The conversion runs entirely in this browser tab: your WebP is decoded locally and
            re-encoded as AVIF with a WebAssembly build of libavif. Nothing is uploaded, the tool
            works offline, and the image stays on your device.
          </p>

          <h3>When it is not worth converting</h3>
          <p>
            If your toolchain already handles WebP end-to-end and file size is not hurting, the gain
            may not justify the switch — WebP remains more widely supported in older software. Both
            formats play in every current browser, so for pure web use it comes down to size versus
            tooling. The full comparison lives in{" "}
            <Link href="/guides/avif-vs-webp">AVIF vs WebP</Link>.
          </p>

          <h3>Quality, briefly</h3>
          <p>
            Both formats are lossy here, so the AVIF stores the WebP&apos;s decoded pixels. At the 82%
            default the result is visually identical for practical purposes. As always with lossy
            chains, convert from the highest-quality source you have. Need a universally editable
            file instead? <Link href="/webp-to-png">WebP to PNG</Link> is the lossless route.
          </p>
        </>
      }
      faqs={[
        { question: "Does AVIF keep WebP transparency?", answer: "Yes. Both formats support a full alpha channel, so transparent and semi-transparent areas carry over intact." },
        { question: "How much smaller will the AVIF be?", answer: "Commonly 20–50% smaller than the WebP at equivalent visual quality. The exact saving depends on the image — photos and gradients gain the most." },
        { question: "Will converting hurt image quality?", answer: "Not visibly at the default setting. The AVIF stores the WebP's decoded pixels; at 82% quality and above the difference is imperceptible in practice." },
        { question: "Is my WebP uploaded anywhere?", answer: "No. Decoding and encoding run locally in your browser with a WebAssembly codec — the image never leaves your device and the tool works offline." },
        { question: "Should I use AVIF or WebP on my website?", answer: "AVIF gives smaller files; WebP gives wider tool support. Many sites serve AVIF with a WebP or JPG fallback for older software. Every current browser reads both." },
        { question: "Can I convert several WebP files at once?", answer: "The tool processes one image at a time. Convert the first, then load the next — each stays on your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/avif" accept="image/webp,.webp" />
    </ToolPageShell>
  );
}
