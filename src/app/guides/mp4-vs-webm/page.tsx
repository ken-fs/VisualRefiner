import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/mp4-vs-webm")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function Mp4VsWebmGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        { question: "What is the difference between a container and a codec?", answer: "The container is the file wrapper — MP4 or WebM — that packages the video, audio, and metadata together. The codec is the compression method used for the actual video stream inside, such as H.264 or VP9. MP4 usually carries H.264, and WebM carries VP8, VP9, or AV1. When people compare the two, they are really comparing the typical container-and-codec pairings." },
        { question: "Which format plays on the most devices?", answer: "MP4 with H.264 video is the most universally supported combination. It plays on phones, in video editors, on social platforms, in messaging apps, and in old software. If you are unsure where the video will end up, MP4 is the safe pick." },
        { question: "When is WebM the better choice?", answer: "WebM suits modern web pages, especially video you host and embed yourself, where it can deliver similar quality at a smaller size. Use it when you control playback in a current browser. It is a weaker choice for sharing, since some editors, phones, and messaging apps reject it." },
        { question: "Does converting between MP4 and WebM lose quality?", answer: "Yes, a little. Both are lossy formats, and switching containers means re-encoding the video rather than simply relabeling it, so a small amount of detail is discarded. Converting once is usually fine; repeatedly re-encoding the same clip is what visibly degrades it." },
        { question: "Why did my video fail to convert?", answer: "Conversion runs in your browser and relies on the codecs your browser supports, so an unusual track or a codec the browser cannot handle can stop it. If one output format fails, trying the other sometimes works. Support varies from browser to browser." },
        { question: "Can I just try both?", answer: "Yes. The safest way to choose is to convert to each, then see which plays where you need it and which file size you prefer. The video converter produces one file at a time, locally, so nothing is uploaded while you compare." },
      ]}
    >
      <p>
        MP4 and WebM are both <em>containers</em> — file wrappers that hold compressed video and audio together. The
        practical difference between them is reach versus efficiency. MP4, usually carrying H.264 video, plays almost
        everywhere: phones, editors, social platforms, messaging apps, and old software. WebM is built for the modern
        web and can deliver similar quality at a smaller size, but it is not as universally accepted once you step
        outside a browser.
      </p>

      <h2>Container vs codec, simply</h2>
      <p>
        It helps to separate two things people often blur together:
      </p>
      <ul>
        <li>
          <strong>The container</strong> is the box — <code>.mp4</code> or <code>.webm</code> — that packages the
          video stream, the audio stream, and metadata into one file.
        </li>
        <li>
          <strong>The codec</strong> is how the video inside is compressed. MP4 typically holds H.264 (and sometimes
          HEVC/H.265); WebM holds VP8, VP9, or AV1.
        </li>
      </ul>
      <p>
        So when someone asks &ldquo;MP4 or WebM?&rdquo; they are usually comparing the common pairings — MP4 + H.264
        versus WebM + VP9 — not just the wrappers. That pairing is what determines both how widely the file plays and
        how small it gets.
      </p>

      <h2>MP4: near-universal compatibility</h2>
      <p>
        MP4 with H.264 is the closest thing video has to a universal default. It has been around long enough, and is
        supported broadly enough, that you rarely have to think about whether it will play. Phones open it, video
        editors import it, social platforms accept it on upload, messaging apps pass it through, and even dated
        software usually manages. The efficiency is a step behind the newest codecs, but the payoff is that the file
        just works.
      </p>

      <h2>WebM: open and web-oriented</h2>
      <p>
        WebM is an open format designed for the web. Paired with VP9 or AV1 it can reach a smaller file at comparable
        quality, which is appealing for video you host and embed on a page you control. The catch is reach: some video
        editors will not import it, many phones do not treat it as a native video type, and several messaging apps and
        upload forms reject it. It shines in the browser and struggles almost everywhere else.
      </p>

      <table className="compare-table">
        <thead>
          <tr><th>&nbsp;</th><th>MP4 (H.264)</th><th>WebM (VP9/AV1)</th></tr>
        </thead>
        <tbody>
          <tr><th>Compatibility</th><td>Near-universal</td><td>Great in browsers, patchy elsewhere</td></tr>
          <tr><th>File size</th><td>Larger at the same quality</td><td>Often smaller</td></tr>
          <tr><th>Editors &amp; phones</th><td>Widely supported</td><td>Frequently rejected</td></tr>
          <tr><th>Social &amp; messaging</th><td>Accepted almost everywhere</td><td>Hit-and-miss</td></tr>
          <tr><th>Best for</th><td>Sharing, uploading, anything uncertain</td><td>Self-hosted web video you control</td></tr>
        </tbody>
      </table>

      <h2>When to pick each</h2>
      <p>
        <strong>Pick MP4</strong> when you are sharing the video, uploading it to a platform, sending it to someone,
        or simply are not certain what will play it. It is the safe default for compatibility.
      </p>
      <p>
        <strong>Pick WebM</strong> when the video lives on a web page you control and you want a smaller file for
        faster loading in current browsers. If you are not sure which you need, start with MP4 — you can always make a
        WebM copy too.
      </p>

      <h2>Converting re-encodes the video</h2>
      <p>
        Changing between MP4 and WebM is not a rename — it re-encodes the video into the new codec, which is a lossy
        step that discards a little detail. Converting once is usually invisible; repeatedly re-encoding the same clip
        is what adds up. Conversion here also depends on your browser: it uses the browser&apos;s own codec support,
        so an unusual input or a codec the browser cannot handle may fail, and what works can differ from one browser
        to another. If one output format does not work, the other sometimes will.
      </p>

      <h2>Convert it locally</h2>
      <p>
        You do not have to guess — convert to each and compare. The{" "}
        <Link href="/video-converter">video converter</Link> turns a supported clip into MP4 or WebM inside your
        browser, one file at a time, with no upload and no queue. If your source is a specific type, the{" "}
        <Link href="/webm-to-mp4">WebM to MP4</Link> and <Link href="/mov-to-mp4">MOV to MP4</Link> tools go straight
        to the compatible format most places expect. And for a short shareable loop rather than a video file, the{" "}
        <Link href="/video-to-gif">video to GIF</Link> tool makes a GIF that plays inline almost anywhere.
      </p>
    </GuideShell>
  );
}
