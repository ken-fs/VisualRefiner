import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/webp-vs-png")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function WebpVsPngGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        { question: "Is WebP always smaller than PNG?", answer: "For photos and detailed images, almost always. For simple graphics with few colors the gap is smaller, and occasionally PNG wins. Convert and compare the sizes if it matters." },
        { question: "Do all browsers support WebP?", answer: "Yes. Every current major browser supports WebP. Very old software may not, which is the main reason to keep a PNG or JPG copy for maximum compatibility." },
        { question: "Does WebP keep transparency?", answer: "Yes, WebP supports an alpha channel, so transparent PNGs stay transparent when converted." },
      ]}
    >
      <p>
        PNG and WebP can both store transparency, so the real question is usually file size and where the image will
        be used. PNG is lossless: it keeps every pixel exactly, which makes it large but perfect for crisp graphics,
        logos, and screenshots with sharp edges. WebP can be either lossy or lossless and, at a matched visible
        quality, is typically much smaller.
      </p>

      <h2>Choose PNG when</h2>
      <p>
        You need guaranteed lossless quality, sharp text or UI edges, or the widest possible compatibility with older
        tools. Flat graphics and screenshots are the classic PNG cases.
      </p>

      <h2>Choose WebP when</h2>
      <p>
        The image goes on the web and load speed matters. WebP keeps transparency, is supported by every current
        browser, and usually cuts the file size noticeably compared with PNG.
      </p>

      <h2>Convert and compare</h2>
      <p>
        The fastest way to decide is to try both and look at the result. Use the{" "}
        <Link href="/png-to-webp">PNG to WebP converter</Link> to make a web copy, or the{" "}
        <Link href="/image-converter">image converter</Link> to move freely between JPG, PNG, and WebP. Everything runs
        in your browser — nothing is uploaded.
      </p>
    </GuideShell>
  );
}
