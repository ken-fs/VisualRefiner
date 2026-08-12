import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description: "Plain-language guides to image and video formats: WebP vs PNG, HEIC, compression quality, and MP4 vs WebM.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <main className="prose-page guides-index">
      <JsonLd data={breadcrumbSchema([{ name: "Home", slug: "/" }, { name: "Guides", slug: "/guides" }])} />
      <h1>Guides</h1>
      <p>
        Format names are confusing and the right choice depends on what you need. These short guides explain the
        common decisions in plain language, and each one links to the tool that does the job.
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
