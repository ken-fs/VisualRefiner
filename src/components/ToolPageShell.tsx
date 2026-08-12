import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, webApplicationSchema, type Faq } from "@/lib/schema";

type ToolPageShellProps = {
  title: string;
  description: string;
  note: string;
  slug: string;
  children: ReactNode;
  steps: string[];
  faqs?: Faq[];
};

export function ToolPageShell({ title, description, note, slug, children, steps, faqs }: ToolPageShellProps) {
  const schema: object[] = [
    webApplicationSchema({ name: title, description, slug }),
    breadcrumbSchema([{ name: "Home", slug: "/" }, { name: title, slug }]),
  ];
  if (faqs?.length) schema.push(faqSchema(faqs));

  return (
    <main className="tool-page">
      <JsonLd data={schema} />
      <Link className="back-link" href="/#all-tools">
        <Icon icon="ph:arrow-left" width="18" aria-hidden="true" />
        All tools
      </Link>
      <header className="tool-page-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <p className="tool-note">
          <Icon icon="ph:shield-check" width="20" aria-hidden="true" />
          {note}
        </p>
      </header>
      {children}
      <section className="tool-steps" aria-labelledby="steps-title">
        <h2 id="steps-title">How it works</h2>
        <ol>
          {steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>
      {faqs?.length ? (
        <section className="tool-faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Questions</h2>
          <dl>
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </main>
  );
}
