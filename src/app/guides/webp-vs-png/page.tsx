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
        { question: "Is WebP always smaller than PNG?", answer: "For photos and detailed images, almost always — lossy WebP can cut the file dramatically. For simple graphics with few flat colours the gap is smaller, and now and then a well-optimised PNG wins. If it matters, convert both and compare the sizes." },
        { question: "Do all browsers support WebP?", answer: "Yes. Every current major browser reads WebP, and has for years. The gaps are in older or niche software — some legacy image editors, a few email clients, and older operating-system previewers — which is the main reason to keep a PNG or JPG copy when maximum compatibility matters." },
        { question: "Does WebP keep transparency?", answer: "Yes. WebP supports a full alpha channel, so a transparent PNG stays transparent when you convert it, whether you save lossy or lossless WebP." },
        { question: "Is converting PNG to WebP lossless?", answer: "It can be. WebP has a lossless mode that keeps every pixel exactly, and a lossy mode that discards detail for a smaller file. For a screenshot or logo you want lossless; for a photo, lossy WebP is usually the better trade." },
        { question: "Will converting PNG to WebP lose quality?", answer: "Lossless WebP loses nothing. Lossy WebP drops some detail, like JPG does, in exchange for a much smaller file — on a photo that loss is usually invisible, but on sharp text or flat edges it can show. Keep your PNG original either way." },
        { question: "Should I use WebP or JPG for photos?", answer: "WebP typically reaches a smaller file than JPG at the same visible quality and also supports transparency, so it is the better modern choice for the web. JPG still wins on raw compatibility with very old tools. If the destination is unknown, JPG is the safe fallback." },
      ]}
    >
      <p>
        PNG and WebP can both store transparency, so the real decision usually comes down to file size and where the
        image will end up. Both are strong formats — they just optimise for different things. Getting the choice right
        keeps graphics crisp and pages fast without guessing.
      </p>

      <h2>What each format actually is</h2>
      <p>
        <strong>PNG</strong> is a lossless format. It keeps every pixel exactly as it was, forever, no matter how many
        times you open and re-save it. That fidelity is why PNG files are larger — nothing is thrown away — and why
        PNG is the natural home for sharp graphics, logos, icons, and screenshots where every edge has to stay clean.
        It also supports full alpha transparency.
      </p>
      <p>
        <strong>WebP</strong> is a newer format that can work two ways. In <em>lossy</em> mode it discards the detail
        your eye is least likely to notice, much like JPG, and reaches a far smaller file. In <em>lossless</em> mode it
        keeps every pixel, like PNG, but usually still packs it more efficiently. WebP supports transparency in both
        modes, which is what makes it a genuine replacement for PNG on the web rather than just a JPG alternative.
      </p>

      <h2>Lossy vs lossless, and why it matters</h2>
      <p>
        The lossy-versus-lossless split is the heart of the comparison. Lossless means the decoded image is pixel-for-pixel
        identical to the original; lossy means the encoder approximates it to save space. On a photograph, a good lossy
        encoder throws away detail you would never spot, so lossy WebP gives you most of PNG&apos;s look at a fraction of
        the size. On a screenshot full of crisp text, that same approximation smears edges and adds a faint haze around
        letters — exactly where lossless PNG stays perfect.
      </p>
      <p>
        So the format question is really a content question: is this image made of smooth photographic gradients, or of
        sharp lines and flat colour? The answer points you straight at the right tool.
      </p>

      <h2>File size and transparency</h2>
      <p>
        For photographs and busy, detailed images, lossy WebP is typically much smaller than PNG at a matched visible
        quality — often dramatically so. For simple graphics with a handful of flat colours, PNG is already efficient and
        the gap narrows; occasionally a well-optimised PNG even comes out ahead. Both formats preserve transparency, so
        neither one forces you to flatten an image onto a background.
      </p>
      <p>
        Because the winner depends on the specific image, the honest answer is to try both and look at the numbers. The{" "}
        <Link href="/png-to-webp">PNG to WebP converter</Link> makes a web copy in one step, and the{" "}
        <Link href="/webp-to-png">WebP to PNG converter</Link> goes the other way when you need a lossless version back.
        The <Link href="/image-converter">image converter</Link> moves freely between JPG, PNG, and WebP. Everything runs
        in your browser through the Canvas API — nothing is uploaded, one file at a time.
      </p>

      <h2>Support: broad, but not universal</h2>
      <p>
        WebP support is no longer a real concern for the web itself. Every current major browser reads it, and has for
        years. Where you still hit walls is older and niche software: some legacy desktop editors, a few email clients,
        and older operating-system image previewers may show an error or a blank thumbnail. PNG, by contrast, opens
        essentially everywhere and always has. That difference is the single best reason to keep a PNG (or JPG) copy when
        an image has to work in places you do not control.
      </p>

      <h2>PNG vs WebP at a glance</h2>
      <table className="compare-table">
        <thead>
          <tr><th></th><th>PNG</th><th>WebP</th></tr>
        </thead>
        <tbody>
          <tr><th>Compression</th><td>Lossless only</td><td>Lossy or lossless</td></tr>
          <tr><th>Transparency</th><td>Yes</td><td>Yes</td></tr>
          <tr><th>Typical size (photos)</th><td>Large</td><td>Much smaller (lossy)</td></tr>
          <tr><th>Sharp text and edges</th><td>Stays crisp</td><td>Crisp only in lossless mode</td></tr>
          <tr><th>Compatibility</th><td>Universal</td><td>All current browsers; a few old tools lag</td></tr>
          <tr><th>Best for</th><td>Graphics, logos, screenshots</td><td>Photos and images for the web</td></tr>
        </tbody>
      </table>

      <h2>A decision framework</h2>
      <h3>Choose WebP when</h3>
      <ul>
        <li>The image is a photograph or a detailed, gradient-heavy picture.</li>
        <li>It is going on the web and load speed matters.</li>
        <li>You want transparency <em>and</em> a smaller file than PNG can give.</li>
      </ul>
      <h3>Choose PNG when</h3>
      <ul>
        <li>The image is a screenshot, logo, icon, or flat graphic with sharp edges.</li>
        <li>You need guaranteed lossless quality, or you will keep editing and re-saving it.</li>
        <li>Maximum compatibility with old or unknown software is the priority.</li>
      </ul>
      <p>
        A simple rule of thumb: photos and web images lean WebP; sharp graphics, screenshots, transparency-critical art,
        and anything that has to open everywhere lean PNG. When you are unsure, convert both with the{" "}
        <Link href="/image-converter">image converter</Link> and compare. If your goal is purely to shrink an existing
        photo, the <Link href="/image-compressor">image compressor</Link> defaults to WebP and lets you dial the quality
        while you watch the size change.
      </p>
    </GuideShell>
  );
}
