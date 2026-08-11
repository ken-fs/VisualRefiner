import Link from "next/link";
import { Icon } from "@iconify/react";
import { tools } from "@/lib/tools";

export function ToolIndex() {
  return (
    <section className="tool-index" id="all-tools" aria-labelledby="tool-index-title">
      <div className="section-heading">
        <h2 id="tool-index-title">Pick the job.</h2>
        <p>One file. One clear result.</p>
      </div>
      <div className="tool-ledger">
        {tools.map((tool) => (
          <Link className="tool-row" href={tool.slug} key={tool.slug}>
            <span className="tool-row-group">{tool.group}</span>
            <span className="tool-row-name">{tool.name}</span>
            <span className="tool-row-copy">{tool.description}</span>
            <span className="tool-row-formats">{tool.formats}</span>
            <Icon icon="ph:arrow-up-right" width="22" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
