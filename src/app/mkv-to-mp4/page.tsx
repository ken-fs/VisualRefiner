import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoConverter } from "@/components/VideoConverter";

export const metadata: Metadata = {
  title: "MKV to MP4 Converter",
  description: "Convert an MKV video to MP4 locally in your browser. No upload, no account — the file stays on your device and never leaves the tab.",
  alternates: { canonical: "/mkv-to-mp4" },
};

export default function MkvToMp4Page() {
  return (
    <ToolPageShell
      title="MKV to MP4"
      description="Turn an MKV file into a widely supported MP4."
      note="Uses your browser codecs"
      slug="/mkv-to-mp4"
      steps={["Choose an MKV video.", "Keep MP4 as the output.", "Convert and download the MP4."]}
      explainer={
        <>
          <h2 id="learn-title">Why MKV is awkward, and MP4 is not</h2>
          <p>
            MKV — Matroska — is a container built to hold almost anything: multiple video and audio tracks,
            several subtitle streams, chapters, and a wide mix of codecs, all in one file. That flexibility
            is exactly why it shows up so often in downloads, backups, and disc rips. It is also why it
            travels badly. Plenty of phones, smart TVs, browsers, and video editors simply refuse to open an
            MKV, or open it with no sound. MP4 carries the same kind of video and audio but in a wrapper
            almost everything recognises, which is why converting is usually the quickest way to make a file
            just work.
          </p>
          <p>
            The distinction that matters here is <strong>container</strong> versus <strong>codec</strong>.
            The container (MKV or MP4) is only the box that packages the streams together. The codec (H.264,
            HEVC, VP9, AAC, and so on) is how each stream is actually compressed. Converting MKV to MP4
            repackages the streams into the MP4 box and re-encodes them so the result plays cleanly. Because
            MKV can hold such an unusual range of codecs, whether a particular file converts here depends on
            what your browser can decode — most common video and audio decode fine, but an exotic track may
            not be supported, and the tool will tell you if it cannot read one.
          </p>
          <p>
            Everything happens inside this browser tab. Your MKV is decoded and re-encoded locally using the
            codecs your browser ships with, so nothing is uploaded, no account is needed, and the file never
            leaves your device. It works on one video at a time.
          </p>

          <h3>What conversion does and does not carry over</h3>
          <ul>
            <li>
              <strong>The main video and audio</strong> come across — that is the point, and it is what
              makes the file playable in ordinary apps.
            </li>
            <li>
              <strong>Extras that make MKV special</strong> — multiple audio tracks, embedded subtitle
              streams, and chapters — are the parts MP4 handles differently or not at all, so a converted
              file is usually the simpler, single-track version.
            </li>
            <li>
              <strong>Very large rips</strong> take time to re-encode. Speed depends on your device and the
              length and resolution of the clip.
            </li>
          </ul>
          <p>
            If a browser-friendly output suits you better, the{" "}
            <Link href="/video-converter">video converter</Link> can produce WebM as well. For the other
            containers people convert most, see <Link href="/mov-to-mp4">MOV to MP4</Link> and{" "}
            <Link href="/webm-to-mp4">WebM to MP4</Link>.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Container type</th><th>Player and phone support</th><th>Typical source</th></tr>
            </thead>
            <tbody>
              <tr><th>MKV</th><td>Very flexible, many tracks</td><td>Patchy — often refused</td><td>Downloads, backups, disc rips</td></tr>
              <tr><th>MP4</th><td>Streamlined, widely standardised</td><td>Broad — plays almost anywhere</td><td>Sharing and everyday playback</td></tr>
              <tr><th>WebM</th><td>Open web format</td><td>Great in browsers</td><td>Video embedded on the web</td></tr>
            </tbody>
          </table>

          <p>
            Re-encoding is lossy, so the MP4 is not an exact copy of the MKV, though a single high-quality
            pass usually looks close to the original. If you are weighing MP4 against a web format, the{" "}
            <Link href="/guides/mp4-vs-webm">MP4 vs WebM guide</Link> explains the trade-off.
          </p>
        </>
      }
      faqs={[
        { question: "Why convert MKV to MP4?", answer: "MKV is flexible but many phones, TVs, browsers, and editors will not open it, or open it without sound. MP4 uses a wrapper that almost everything supports, so converting makes the video easy to play and share." },
        { question: "Why won't my MKV play on my phone or TV?", answer: "Most phones and TVs expect MP4 and do not include the software to read the Matroska container, so the file either fails to open or plays without audio. Converting to MP4 avoids that." },
        { question: "Will every MKV file convert?", answer: "It depends on what is inside. MKV can hold an unusual range of codecs, and the conversion relies on codecs your browser can decode. Common video and audio work; if a track cannot be read, the tool will tell you rather than produce a broken file." },
        { question: "Do subtitles and extra audio tracks come across?", answer: "Not usually. MP4 handles multiple audio tracks, embedded subtitles, and chapters differently from MKV, so a converted file is generally the simpler single-track version of the video." },
        { question: "Is the file uploaded to convert it?", answer: "No. The MKV is decoded and re-encoded inside your browser, so it never leaves your device and no account is required." },
        { question: "Does converting reduce quality?", answer: "Re-encoding is a lossy step, so the MP4 is not a bit-for-bit copy. A single conversion at normal quality usually looks close to the original; avoid converting the same clip over and over." },
      ]}
    >
      <VideoConverter />
    </ToolPageShell>
  );
}
