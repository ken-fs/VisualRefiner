import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description: "Plain-language guides to image and video formats: WebP vs PNG, HEIC, compression quality, and MP4 vs WebM.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <main className="prose-page guides-index">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", slug: "/" }, { name: "Guides", slug: "/guides" }]),
          collectionPageSchema({
            name: "Guides — VisualRefiner",
            description: "Plain-language guides to image and video formats.",
            slug: "/guides",
            items: guides.map((g) => ({ name: g.title, slug: g.slug })),
          }),
        ]}
      />
      <h1>Guides</h1>
      <p>
        Format names are confusing and the right choice depends on what you need. These short guides explain the
        common decisions in plain language, and each one links to the tool that does the job.
      </p>
      <p>
        The collection splits into three practical clusters. <strong>Format decisions</strong> —{" "}
        <Link href="/guides/webp-vs-png">WebP vs PNG</Link>, <Link href="/guides/avif-vs-webp">AVIF vs WebP</Link>,{" "}
        <Link href="/guides/mp4-vs-webm">MP4 vs WebM</Link> — answer "which one do I actually need" for the formats
        that come up most. <strong>Privacy and metadata</strong> —{" "}
        <Link href="/guides/remove-gps-location-from-photos">removing GPS data</Link>,{" "}
        <Link href="/guides/what-is-exif-data">what EXIF even is</Link>,{" "}
        <Link href="/guides/how-to-tell-if-an-image-is-ai-generated">spotting AI-generated images</Link> — cover what
        hides inside a file and how to strip it before sharing. And <strong>quality trade-offs</strong>, led by the{" "}
        <Link href="/guides/image-compression-quality">compression quality guide</Link>, explain what you lose and
        keep when a file gets smaller. Every guide is written to be read in a few minutes and ends at the tool that
        applies it.
      </p>
      <ul className="guide-list">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link href={guide.slug}>
              <span className="guide-list-text">
                <strong>{guide.title}</strong>
                <span>{guide.hook}</span>
              </span>
              <Icon icon="ph:arrow-up-right" width="20" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
