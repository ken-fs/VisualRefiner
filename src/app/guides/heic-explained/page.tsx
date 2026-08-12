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
        { question: "Why can't I open a HEIC file?", answer: "Many apps and websites, especially on Windows and older software, do not support HEIC. Windows only previews it after you install the HEIF Image Extensions codec from the Microsoft Store, and plenty of upload forms and editors reject it outright. Converting to JPG produces a file almost anything can open." },
        { question: "Is HEIC the same as HEIF?", answer: "Nearly. HEIF is the container format that can hold images and image sequences; HEIC is the name for HEIF files that store their picture with HEVC compression, which is what iPhones save. You will see either a .heic or .heif extension, and in everyday use people treat the terms as interchangeable." },
        { question: "Is HEIC better quality than JPG?", answer: "HEIC stores similar visible quality in a smaller file thanks to newer compression, so at a given size it can look better than JPG. But converting to JPG is about compatibility, not an upgrade — you are moving to a format more things can read, not making the photo sharper." },
        { question: "Will converting HEIC to JPG reduce quality?", answer: "JPG is lossy, so there is a small quality step when you save one. Converting once from the HEIC original at high quality is hard to tell apart from the source. What you want to avoid is re-saving the same JPG repeatedly, since each save discards a little more detail." },
        { question: "Should I convert HEIC to JPG, PNG, or WebP?", answer: "JPG for sharing and broad compatibility, PNG when you need a lossless copy or transparency, and WebP for the smallest web-friendly file at similar quality. For a phone photo you are sending to someone, JPG is almost always the right pick." },
        { question: "Is my photo uploaded when I convert it?", answer: "No. The converters here decode and re-save the photo inside your browser tab, one file at a time, so the image never leaves your device and the tool works offline." },
      ]}
    >
      <p>
        HEIC is the image format iPhones and iPads have saved by default since iOS 11 landed in 2017. It uses newer
        compression to keep a photo at close to JPG quality in a noticeably smaller file. The trade-off is support:
        plenty of apps, websites, and Windows tools still cannot open HEIC directly, which is why an iPhone photo so
        often refuses to load somewhere it should just work.
      </p>

      <h2>What HEIC actually is</h2>
      <p>
        HEIC stands for High Efficiency Image Container. The picture inside it is compressed with HEVC — the same
        codec family used for high-efficiency video — which is how it fits comparable detail into a smaller file than
        JPG manages. It can also store extras a single JPG cannot, such as transparency, image sequences, and the
        frames behind a Live Photo.
      </p>

      <h3>HEIC vs HEIF</h3>
      <p>
        The two names cause a lot of confusion, but the distinction is small. HEIF (High Efficiency Image File Format)
        is the container. HEIC is the specific case where that container holds a picture compressed with HEVC — which
        is exactly what an iPhone writes. You may see a <code>.heic</code> or a <code>.heif</code> extension on the
        same kind of file, and for everyday purposes you can treat them as the same thing.
      </p>

      <h2>Why your iPhone uses it</h2>
      <p>
        Apple&apos;s reason was storage. A phone camera shoots a lot of photos, and HEIC keeps them at good quality
        while taking up meaningfully less space than the equivalent JPGs would. On an Apple device the format is
        seamless — Photos, Messages, and AirDrop all handle it, and many share sheets quietly hand off a JPG when the
        other end needs one. The friction only shows up when you move a raw <code>.heic</code> file off Apple&apos;s
        turf.
      </p>

      <h2>Why support outside Apple is patchy</h2>
      <p>
        HEIC arrived years after JPG became the universal default, and it carries HEVC&apos;s licensing baggage, so
        adoption has been uneven:
      </p>
      <ul>
        <li>
          <strong>Windows</strong> can only preview HEIC after you install the HEIF Image Extensions codec from the
          Microsoft Store. Without it, File Explorer and many apps just show an error.
        </li>
        <li>
          <strong>Websites and upload forms</strong> frequently reject <code>.heic</code> on principle, expecting a
          JPG or PNG instead.
        </li>
        <li>
          <strong>Older editors and viewers</strong> often have no idea what the file is and refuse to open it.
        </li>
        <li>
          <strong>Android and browsers</strong> vary — some handle HEIC now, many still do not, so it is not something
          to rely on when you are sending a photo to someone else.
        </li>
      </ul>
      <p>
        JPG has none of these problems: it opens on essentially everything, which is why converting is usually the
        fastest fix rather than hunting for a codec.
      </p>

      <h2>How to open or convert it</h2>
      <p>
        The simplest fix is to convert the photo to a format the destination understands. The{" "}
        <Link href="/heic-to-jpg">HEIC to JPG converter</Link> decodes the photo and re-saves it inside your browser
        tab — the image is never uploaded, so it works offline and stays on your device. You handle one photo at a
        time: convert the first, download it, then load the next. From there the JPG will open and upload anywhere.
      </p>

      <h2>Which target format should you pick?</h2>
      <p>
        Where the photo is going decides the format:
      </p>
      <ul>
        <li>
          <strong>JPG</strong> — the safe default for a photo you want to share, upload, or open anywhere. Use{" "}
          <Link href="/heic-to-jpg">HEIC to JPG</Link>.
        </li>
        <li>
          <strong>PNG</strong> — worth it when you need a lossless copy or transparency. Because the HEIC is first
          decoded and then re-encoded, a PNG here is not bit-for-bit identical to the camera original — but PNG adds
          no further lossy compression on top, so nothing degrades from that step. Expect a much larger file. Use{" "}
          <Link href="/heic-to-png">HEIC to PNG</Link>.
        </li>
        <li>
          <strong>WebP</strong> — the smallest web-friendly copy at similar quality to JPG, best when the destination
          is a web page. Support is broad now, though a few older tools still cannot read it. Use{" "}
          <Link href="/heic-to-webp">HEIC to WebP</Link>.
        </li>
      </ul>

      <table className="compare-table">
        <thead>
          <tr><th>Format</th><th>Type</th><th>Transparency</th><th>Best for</th></tr>
        </thead>
        <tbody>
          <tr><th>HEIC</th><td>Lossy, high efficiency</td><td>Yes</td><td>Saving space on Apple devices</td></tr>
          <tr><th>JPG</th><td>Lossy</td><td>No</td><td>Sharing photos anywhere</td></tr>
          <tr><th>PNG</th><td>Lossless</td><td>Yes</td><td>Graphics, transparency, an archival copy</td></tr>
          <tr><th>WebP</th><td>Lossy or lossless</td><td>Yes</td><td>Smaller images for the web</td></tr>
        </tbody>
      </table>

      <h2>Keep the file size sensible</h2>
      <p>
        A converted JPG can actually be larger than the HEIC it came from, because HEIC compresses harder. If size
        matters, run the result through the <Link href="/image-compressor">image compressor</Link> — it re-saves at a
        quality setting you control, starting around 82%, which is clearly smaller with little visible loss. Or convert
        straight to <Link href="/heic-to-webp">WebP</Link> for a smaller file to begin with. Either way, keep your
        HEIC original if you might want the full-quality version later, since detail removed by compression cannot be
        restored by saving again at a higher number.
      </p>

      <h2>The short version</h2>
      <p>
        HEIC is a smart, space-saving format that Apple made the default and the rest of the world has been slow to
        fully adopt. When a photo will only live on Apple devices, leave it as HEIC. The moment it needs to travel —
        to a Windows PC, an upload form, an older editor, or someone on another platform — convert it, and pick JPG
        unless you have a specific reason to reach for PNG or WebP.
      </p>
    </GuideShell>
  );
}
