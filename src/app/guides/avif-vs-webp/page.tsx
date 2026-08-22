import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/avif-vs-webp")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function AvifVsWebpGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        { question: "Is AVIF better than WebP?", answer: "On compression, usually yes — AVIF often reaches a smaller file at the same quality, especially for photos, and handles gradients and dark scenes with fewer artefacts. WebP wins on maturity: broader support and faster encoding. Which is 'better' depends on whether you value smaller files or wider compatibility." },
        { question: "Which has better browser support?", answer: "WebP is supported essentially everywhere current. AVIF is supported in all major modern browsers too, but its rollout is more recent and some older or niche environments lag. For the widest reach with no thought, WebP is the safer default; for the smallest files in current browsers, AVIF." },
        { question: "Do both support transparency and animation?", answer: "Both support transparency (an alpha channel). Both can also do animation, though WebP's animation support is more widely used in practice while AVIF's is newer. For still images, both are strong." },
        { question: "Why is AVIF slower?", answer: "AVIF uses AV1 image compression, which is more computationally intensive to encode than WebP. That means longer encode times, which matters if you are batch-processing many images, but is rarely noticeable for a single file." },
        { question: "Which should I use for my website?", answer: "If you serve modern browsers and want the smallest files, AVIF with a WebP or JPG fallback is ideal. If you want one format that just works with minimal setup, WebP is the pragmatic pick and still far smaller than JPG or PNG." },
        { question: "Can this tool make AVIF files?", answer: "VisualRefiner converts between JPG, PNG, and WebP in the browser. For the smallest widely-supported files today, convert to WebP; it captures most of the size win with none of the support caveats." },
      ]}
    >
      <p>
        AVIF and WebP are both modern image formats designed to beat JPG and PNG on size. They overlap a lot — both
        do lossy and lossless, transparency, and animation — so the real question is a trade-off between{" "}
        <strong>how small</strong> and <strong>how universally it plays</strong>.
      </p>

      <h2>Size and quality</h2>
      <p>
        AVIF, built on AV1 compression, usually wins on raw efficiency: at the same visual quality it often produces a
        smaller file than WebP, and it handles smooth gradients and dark scenes with fewer blocky artefacts. WebP is
        still a big step down from JPG and PNG in size — just not quite as aggressive as AVIF on demanding images.
      </p>

      <h2>Support and speed</h2>
      <p>
        WebP is the mature option: supported across current browsers and tooling, and fast to encode. AVIF is
        supported in every major modern browser as well, but its rollout is newer, so older or niche environments are
        likelier to miss it. AVIF also encodes more slowly, which matters when you are processing many images at once.
      </p>

      <table className="compare-table">
        <thead>
          <tr><th>&nbsp;</th><th>AVIF</th><th>WebP</th></tr>
        </thead>
        <tbody>
          <tr><th>File size</th><td>Usually smallest</td><td>Small, a step behind AVIF</td></tr>
          <tr><th>Quality on hard images</th><td>Fewer artefacts</td><td>Good, occasionally blockier</td></tr>
          <tr><th>Browser support</th><td>All modern, newer rollout</td><td>Essentially universal</td></tr>
          <tr><th>Encode speed</th><td>Slower</td><td>Faster</td></tr>
          <tr><th>Transparency</th><td>Yes</td><td>Yes</td></tr>
          <tr><th>Best for</th><td>Smallest files in modern browsers</td><td>One format that just works</td></tr>
        </tbody>
      </table>

      <h2>Which to pick</h2>
      <p>
        <strong>Pick AVIF</strong> when you serve modern browsers and want the smallest possible files — ideally with
        a WebP or JPG fallback for anything that cannot render it. <strong>Pick WebP</strong> when you want one format
        with minimal fuss and near-universal support; it still captures most of the size win over{" "}
        <Link href="/guides/webp-vs-png">PNG</Link> and JPG.
      </p>

      <h2>Convert locally</h2>
      <p>
        VisualRefiner converts between JPG, PNG, and WebP right in your browser — no upload. For the best mix of small
        size and support today, run your images through the{" "}
        <Link href="/image-converter">image converter</Link> and target WebP, or shrink an existing photo with the{" "}
        <Link href="/image-compressor">image compressor</Link>.
      </p>
    </GuideShell>
  );
}
