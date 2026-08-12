import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/image-compression-quality")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function CompressionQualityGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        { question: "What quality should I use for web photos?", answer: "Around 80–85% is a good default for photographs. It removes most of the file size while staying visually clean. Lower it further only if you can accept softer detail." },
        { question: "Does higher quality always look better?", answer: "Past a point the eye stops noticing improvements while the file keeps growing. Above roughly 90% you usually pay in size for detail no one sees." },
        { question: "Should I compress PNG graphics the same way?", answer: "The quality percentage applies to lossy formats like JPG and WebP. For flat graphics that need lossless edges, keep PNG instead of pushing quality down." },
      ]}
    >
      <p>
        The quality control on a compressor decides how much detail a lossy format keeps. At 100% the file is large
        and near-perfect; as you lower the percentage, the file shrinks and fine detail is gradually discarded. The
        goal is to find the point where the image still looks right but the file is much smaller.
      </p>

      <h2>A good starting point</h2>
      <p>
        For most photographs, start around 82%. That range removes the bulk of the file size while keeping the image
        visually clean. Drop lower only until you can just start to notice the difference, then step back up.
      </p>

      <h2>Photos vs graphics</h2>
      <p>
        Quality percentages suit photographs and busy images. Flat graphics, logos, and screenshots with sharp edges
        do better as lossless PNG, because lossy compression can smear crisp lines. See{" "}
        <Link href="/guides/webp-vs-png">WebP vs PNG</Link> for that decision.
      </p>

      <h2>Try it on your own image</h2>
      <p>
        The quickest way to learn the setting is to move the slider and watch the size. Open the{" "}
        <Link href="/image-compressor">image compressor</Link>, adjust the quality, and compare the before and after —
        all locally, with nothing uploaded.
      </p>
    </GuideShell>
  );
}
