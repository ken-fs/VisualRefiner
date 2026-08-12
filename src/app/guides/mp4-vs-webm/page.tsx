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
        { question: "Which format plays on the most devices?", answer: "MP4 (H.264) is the most universally supported video format. If you are unsure where the video will be watched, MP4 is the safe pick." },
        { question: "When is WebM the better choice?", answer: "WebM is well suited to modern web pages and can produce a smaller file at similar quality. Use it when you control playback in a current browser." },
        { question: "Can I just try both?", answer: "Yes. The safest way to choose is to convert to each and see which plays where you need it and which file size you prefer." },
      ]}
    >
      <p>
        MP4 and WebM are containers that hold compressed video. The practical difference is reach versus efficiency.
        MP4, usually with H.264 video, plays almost everywhere — phones, editors, social platforms, and old software.
        WebM is built for the modern web and can deliver similar quality at a smaller size, but it is not as
        universally accepted outside browsers.
      </p>

      <h2>Pick MP4 when</h2>
      <p>
        You are sharing the video, uploading it somewhere, or you are not certain what will play it. MP4 is the safe
        default for compatibility.
      </p>

      <h2>Pick WebM when</h2>
      <p>
        The video lives on a web page you control and you want a smaller file for faster loading in current browsers.
      </p>

      <h2>Convert it locally</h2>
      <p>
        You do not have to guess — convert to each and compare. The{" "}
        <Link href="/video-converter">video converter</Link> turns a supported clip into MP4 or WebM inside your
        browser, with no upload queue. For a short shareable loop instead, try the{" "}
        <Link href="/video-to-gif">video to GIF</Link> tool.
      </p>
    </GuideShell>
  );
}
