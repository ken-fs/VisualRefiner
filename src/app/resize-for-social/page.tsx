import type { Metadata } from "next";
import { ResizeForSocialWorkspace } from "@/components/ResizeForSocialWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Resize Images for Instagram, Amazon, TikTok & More (All Sizes at Once)",
  description:
    "One photo in, every platform size out: Instagram post/story, TikTok, YouTube thumbnail, Amazon 2000×2000, Shopify, Etsy, Pinterest, X and Facebook. Exact pixels, no cropping mistakes, nothing uploaded.",
  alternates: { canonical: "/resize-for-social" },
};

export default function ResizeForSocialPage() {
  return (
    <ToolPageShell
      title="Resize for every platform"
      description="Pick a photo once and export the exact pixels Instagram, TikTok, YouTube, Amazon, Shopify, Etsy, Pinterest, X, and Facebook expect — all sizes in one pass."
      note="Resized locally, never uploaded"
      slug="/resize-for-social"
      steps={[
        "Choose a photo.",
        "Tick the platform sizes you need and pick Fill (crop) or Fit (letterbox).",
        "Resize and download each ready-to-upload file.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">The exact pixels each platform wants</h2>
          <p>
            Platforms compress anything that doesn&apos;t match their preferred dimensions — a 3:2 photo posted
            to a 4:5 Instagram slot gets auto-cropped, and a small Amazon image loses the zoom. Exporting the
            <strong> exact recommended size</strong> keeps you in control of the crop and the sharpness.
          </p>
          <h3>Fill or Fit?</h3>
          <p>
            <strong>Fill</strong> center-crops to the exact ratio — edges are trimmed but pixels are used
            fully; this is what platform uploaders do, so do it first and choose what gets cut.
            <strong> Fit</strong> keeps the whole image and pads the sides — required for product photos on
            marketplaces where nothing may be cropped. Padding is white, or transparent when you export PNG.
          </p>
          <h3>Product photos</h3>
          <p>
            For Amazon&apos;s 2000×2000 main image, start from a clean cutout — the{" "}
            <a href="/remove-background">background remover</a> gives you a white-background PNG, then this
            tool maps it onto the exact marketplace canvas.
          </p>
        </>
      }
      faqs={[
        {
          question: "What sizes are included?",
          answer:
            "Instagram Post 1080×1080, Portrait 1080×1350, Story/Reel 1080×1920, TikTok 1080×1920, YouTube Thumbnail 1280×720, X Post 1600×900, Pinterest Pin 1000×1500, Facebook Post 1200×630, Amazon Product 2000×2000, Shopify Product 2048×2048, and Etsy Listing 2700×2025.",
        },
        {
          question: "Will resizing make my photo blurry?",
          answer:
            "Downscaling stays crisp — the tool uses a high-quality resampling filter. If the target is larger than your photo it will upscale, which can't add detail; start from the biggest source you have.",
        },
        {
          question: "JPG, PNG, or WebP?",
          answer:
            "JPG is accepted everywhere and keeps files small for photos. Choose PNG when you need to keep a transparent background (e.g. a cutout product), WebP for the smallest files on platforms that accept it.",
        },
        {
          question: "Is the photo uploaded anywhere?",
          answer:
            "No. All resizing happens in your browser with local canvas processing — the photo never leaves your device.",
        },
        {
          question: "How is this different from the Image resizer?",
          answer:
            "The Image resizer lets you type any width and height for one output. This tool targets the named platform presets and produces all of them in one pass, with crop or letterbox handling built in.",
        },
      ]}
    >
      <ResizeForSocialWorkspace />
    </ToolPageShell>
  );
}
