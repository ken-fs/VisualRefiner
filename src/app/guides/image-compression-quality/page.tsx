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
        { question: "What quality should I use for web photos?", answer: "Around 82% is a good default for photographs — roughly the 80–85% range. It removes most of the file size while staying visually clean. Lower it further only if you can accept softer detail, and check the preview as you go." },
        { question: "Does higher quality always look better?", answer: "Only up to a point. Past roughly 90% the eye stops noticing improvements while the file keeps growing, so you pay in size for detail no one sees. The sweet spot is the lowest setting where the image still looks right to you." },
        { question: "What do compression artifacts look like?", answer: "The common ones are blocky squares in smooth areas like skies, a faint halo or mosquito noise around sharp edges and text, and banding where a smooth gradient breaks into visible steps. They appear because lossy encoders work on small blocks and simplify what is inside them." },
        { question: "Should I compress PNG graphics the same way?", answer: "No. The quality percentage applies to lossy formats like JPG and WebP. Flat graphics, logos, and screenshots with sharp edges do better as lossless PNG — pushing a lossy quality down just smears their crisp lines." },
        { question: "Is compressing the same as resizing?", answer: "No. Compressing keeps the same pixel dimensions but stores them less precisely; resizing changes the dimensions themselves. For an oversized photo, resizing first often saves more than quality does, and the two combine well." },
        { question: "Why does lossless PNG ignore a quality slider?", answer: "A quality percentage tells a lossy encoder how much detail it may discard. Lossless PNG discards nothing by definition, so there is no detail to trade away and no quality knob to turn — it only compresses in ways that can be perfectly reversed." },
      ]}
    >
      <p>
        The quality control on a compressor decides how much detail a lossy format keeps. At 100% the file is large and
        near-perfect; as you lower the percentage, the file shrinks and fine detail is gradually discarded. The goal is
        to find the point where the image still looks right but the file is much smaller — and, usefully, that point is
        often lower than people expect.
      </p>

      <h2>What the quality percentage actually means</h2>
      <p>
        For lossy encoders — JPG and WebP — the quality number is not a measure of how good the image looks. It is an
        instruction to the encoder about how aggressively it may throw detail away. A higher number tells it to preserve
        more and accept a bigger file; a lower number tells it to simplify harder and accept a smaller one. The encoder
        breaks the image into small blocks and, at lower quality, stores each block more coarsely.
      </p>
      <p>
        This is why the scale is not linear. Going from 100% to 90% often cuts the file substantially while looking
        identical, because the first detail discarded is the detail your eye was never going to notice. Going from 60%
        to 50% removes far less size but can visibly degrade the picture, because by then the encoder is cutting into
        detail that matters. Most of the win lives in the top of the range.
      </p>

      <h2>What artifacts look like, and why they appear</h2>
      <p>
        When you push quality too low, the shortcuts the encoder took become visible. The usual signs:
      </p>
      <ul>
        <li><strong>Blocking</strong> — faint squares in smooth areas like skies or walls, because the encoder works on small blocks and flattens what is inside them.</li>
        <li><strong>Ringing or mosquito noise</strong> — a shimmery halo hugging sharp edges and text, where the encoder cannot represent a hard transition cleanly.</li>
        <li><strong>Banding</strong> — a smooth gradient breaking into visible steps, as subtle tonal differences get rounded together.</li>
        <li><strong>Colour smearing</strong> — fine colour detail bleeding, since encoders store colour at lower resolution than brightness.</li>
      </ul>
      <p>
        None of these are random damage — they are the direct, predictable result of asking the encoder to spend fewer
        bits. That is also why the same setting looks fine on one image and rough on another.
      </p>

      <h2>Where to set it</h2>
      <p>
        For most photographs, start around 82%. That range removes the bulk of the file size while keeping the image
        visually clean, and it is the default in the <Link href="/image-compressor">image compressor</Link> for exactly
        that reason. From there, nudge the quality down while watching the preview and stop the moment you can see
        softening — then step back up a notch. The right value is the lowest one that still looks right to <em>you</em>,
        on the image in front of you.
      </p>
      <p>
        Content changes the answer. Photographs, with their natural noise and smooth gradients, tolerate heavy
        compression well. Sharp-edged graphics, logos, and screenshots do not — their crisp lines are precisely what
        lossy compression smears, so they need a higher setting, or a lossless format instead. See{" "}
        <Link href="/guides/webp-vs-png">WebP vs PNG</Link> for that decision.
      </p>

      <h2>How the setting affects size and look</h2>
      <table className="compare-table">
        <thead>
          <tr><th>Quality</th><th>File size</th><th>What you see</th></tr>
        </thead>
        <tbody>
          <tr><th>90–100%</th><td>Largest</td><td>Visually indistinguishable from the original; often wasted bytes</td></tr>
          <tr><th>~82% (default)</th><td>Much smaller</td><td>Clean on photos; the usual sweet spot</td></tr>
          <tr><th>60–75%</th><td>Smaller still</td><td>Fine at a glance; artifacts start showing on detail and edges</td></tr>
          <tr><th>Below ~50%</th><td>Small</td><td>Visible blocking, banding, and haloing</td></tr>
        </tbody>
      </table>

      <h2>Compressing is not resizing</h2>
      <p>
        These two are easy to confuse and do different jobs. <strong>Compressing</strong> keeps the same pixel
        dimensions but stores them less precisely. <strong>Resizing</strong> changes the dimensions themselves — a
        4000-pixel-wide photo displayed at 800 pixels is carrying five times more width than it needs. For oversized
        images, resizing first often saves more than any quality setting, and the two stack: resize with the{" "}
        <Link href="/image-resizer">image resizer</Link>, then compress the smaller result. If you also want to change
        the format along the way, the <Link href="/image-converter">image converter</Link> moves between JPG, PNG, and
        WebP.
      </p>

      <h2>Why lossless formats ignore the slider</h2>
      <p>
        A quality percentage only makes sense for lossy formats, because it governs how much detail may be discarded.
        Lossless formats like PNG discard nothing by definition — the decoded image is pixel-for-pixel identical to the
        original — so there is no detail to trade and no quality knob to turn. PNG still compresses, but only in ways
        that can be perfectly reversed. That is why you set a quality on JPG or WebP but never on PNG.
      </p>

      <h2>Try it on your own image</h2>
      <p>
        The quickest way to build intuition is to move the slider and watch the size. Open the{" "}
        <Link href="/image-compressor">image compressor</Link>, adjust the quality, and compare the before and after.
        Encoding happens locally through the Canvas API, one file at a time, with nothing uploaded — and because
        compression only goes one way, keep your original if you might need the full detail later.
      </p>
    </GuideShell>
  );
}
