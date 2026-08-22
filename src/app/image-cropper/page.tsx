import type { Metadata } from "next";
import Link from "next/link";
import { CropWorkspace } from "@/components/CropWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Image Cropper",
  description: "Crop a JPG, PNG, or WebP in your browser. Drag a selection or lock an aspect ratio, then download the cropped image — no upload, it stays on your device.",
  alternates: { canonical: "/image-cropper" },
};

export default function ImageCropperPage() {
  return (
    <ToolPageShell
      title="Image cropper"
      description="Crop to a free selection or an exact aspect ratio."
      note="No server upload"
      slug="/image-cropper"
      steps={["Choose an image.", "Drag to select the area, or pick an aspect ratio.", "Crop and download the result."]}
      explainer={
        <>
          <h2 id="learn-title">Cropping without uploading</h2>
          <p>
            Cropping trims an image down to the part you want — removing dead space, straightening a
            composition, or cutting a photo to the exact shape a profile picture or thumbnail needs. This tool
            does it entirely in your browser: the image is drawn to a canvas, the selected region is copied out,
            and nothing is ever sent to a server.
          </p>
          <h3>Free selection or a fixed ratio</h3>
          <p>
            Drag anywhere on the image to draw a selection box. If you need a specific shape — a square avatar, a
            16:9 banner, a 4:3 print — pick that aspect ratio first and the box keeps it as you drag. Leave it on
            &ldquo;Free&rdquo; to crop to any rectangle you like.
          </p>
          <h3>Quality and format</h3>
          <p>
            The crop is exported at the source resolution of the selected area, so you keep full detail. Choose PNG
            to stay lossless (best for screenshots and graphics), or JPG/WebP with a quality slider for a smaller
            photo. If you also need to shrink the file afterwards, run it through the{" "}
            <Link href="/image-compressor">image compressor</Link>, or change format with the{" "}
            <Link href="/image-converter">image converter</Link>.
          </p>
        </>
      }
      faqs={[
        { question: "How do I crop the image?", answer: "Drag a rectangle across the image to select the area you want to keep, then click Crop. To constrain the shape, choose an aspect ratio first and the selection keeps that proportion as you drag." },
        { question: "Does cropping reduce quality?", answer: "Cropping itself just copies the selected pixels, so it's lossless. Any quality loss comes only from the output format — PNG stays lossless, while JPG and WebP re-encode at the quality you choose." },
        { question: "Can I crop to a square or 16:9?", answer: "Yes. Pick the aspect ratio from the menu — square, 16:9, 4:3, or 3:2 — and the selection box holds that ratio while you drag, so the crop comes out at exactly that shape." },
        { question: "What formats can I crop?", answer: "JPG, PNG, and WebP. You can also choose which of those to export as, independent of the input." },
        { question: "Is the image uploaded anywhere?", answer: "No. The crop runs on the Canvas API inside your browser tab, so the image never leaves your device and the tool works offline." },
      ]}
    >
      <CropWorkspace />
    </ToolPageShell>
  );
}
