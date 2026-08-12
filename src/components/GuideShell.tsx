import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema, faqSchema, type Faq } from "@/lib/schema";

type GuideShellProps = {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  children: ReactNode;
  faqs?: Faq[];
};

export function GuideShell({ title, description, slug, datePublished, children, faqs }: GuideShellProps) {
  const schema: object[] = [
    articleSchema({ title, description, slug, datePublished }),
    breadcrumbSchema([
      { name: "Home", slug: "/" },
      { name: "Guides", slug: "/guides" },
      { name: title, slug },
    ]),
  ];
  if (faqs?.length) schema.push(faqSchema(faqs));

  return (
    <main className="prose-page">
      <JsonLd data={schema} />
      <Link className="back-link" href="/guides">
        <Icon icon="ph:arrow-left" width="18" aria-hidden="true" />
        All guides
      </Link>
      <h1>{title}</h1>
      {children}
      {faqs?.length ? (
        <>
          <h2>Common questions</h2>
          <dl className="prose-faq">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}
    </main>
  );
}
