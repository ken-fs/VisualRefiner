import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

type ToolPageShellProps = {
  title: string;
  description: string;
  note: string;
  children: ReactNode;
  steps: string[];
};

export function ToolPageShell({ title, description, note, children, steps }: ToolPageShellProps) {
  return (
    <main className="tool-page">
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
    </main>
  );
}
