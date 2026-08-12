import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/heic-explained")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function HeicExplainedGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        { question: "Why can't I open a HEIC file?", answer: "Many apps and websites, especially on Windows and older software, do not support HEIC. Converting to JPG produces a file almost anything can open." },
        { question: "Is HEIC better quality than JPG?", answer: "HEIC stores similar quality in a smaller file thanks to newer compression. Converting to JPG is about compatibility, not an upgrade in quality." },
        { question: "Will converting HEIC to JPG reduce quality?", answer: "There is a small lossy step, but keeping the quality near the default preserves detail while giving you a widely compatible file." },
      ]}
    >
      <p>
        HEIC (High Efficiency Image Container, sometimes seen as HEIF) is the image format iPhones use by default. It
        relies on newer compression to store photos at good quality in a smaller file than JPG. The trade-off is
        support: plenty of apps, websites, and Windows tools still cannot open HEIC directly.
      </p>

      <h2>Why your iPhone uses it</h2>
      <p>
        Apple switched to HEIC to save storage without losing much visible quality. On an Apple device the format is
        seamless. The friction appears when you send the photo somewhere that expects a JPG.
      </p>

      <h2>How to open or share it</h2>
      <p>
        The simplest fix is to convert the photo to JPG, which every device and site understands. Use the{" "}
        <Link href="/heic-to-jpg">HEIC to JPG converter</Link> — it decodes and converts the photo inside your
        browser, so the image never leaves your device. From there you can share it anywhere.
      </p>

      <h2>Keep the file size down</h2>
      <p>
        A converted JPG can be larger than the original HEIC. If size matters, run the result through the{" "}
        <Link href="/image-compressor">image compressor</Link> or convert to{" "}
        <Link href="/jpg-to-webp">WebP</Link> for a smaller web-friendly copy.
      </p>
    </GuideShell>
  );
}
