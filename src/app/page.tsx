import Link from "next/link";
import { Icon } from "@iconify/react";
import { PrivacyPath } from "@/components/PrivacyPath";
import { ToolIndex } from "@/components/ToolIndex";
import { VectorizeWorkspace } from "@/components/VectorizeWorkspace";
import { JsonLd } from "@/components/JsonLd";
import { conversions } from "@/lib/conversions";
import { tools } from "@/lib/tools";
import { itemListSchema } from "@/lib/schema";

// The trace-to-SVG and DXF pages are the site's focus, so they get their own column.
const isVector = (slug: string) => /-to-(svg|dxf)$/.test(slug);

export default function HomePage() {
  return (
    <main>
      <JsonLd data={itemListSchema({ name: "VisualRefiner tools", items: tools.map((t) => ({ name: t.name, slug: t.slug })) })} />
      <section className="home-hero">
        <div className="hero-copy">
          <h1>PNG to SVG &amp; DXF converter</h1>
          <p className="hero-lede">
            Turn images into cut files. Trace a logo or drawing into SVG for Cricut, or DXF for laser and CNC. Plus everyday image and video
            converters. Your files stay on this device.
          </p>
          <div className="hero-links">
            <Link href="/image-to-svg">Trace an image to SVG</Link>
            <Link href="/#all-tools">Browse every tool</Link>
          </div>
          <nav className="hero-task-index" aria-label="Quick tool index">
            <Link href="/png-to-svg">PNG to SVG <Icon icon="ph:arrow-up-right" width="17" /></Link>
            <Link href="/svg-to-dxf">SVG to DXF <Icon icon="ph:arrow-up-right" width="17" /></Link>
            <Link href="/png-to-dxf">PNG to DXF <Icon icon="ph:arrow-up-right" width="17" /></Link>
          </nav>
          <p className="hero-constraints">No upload · No account · Free local tools</p>
        </div>
        <div className="hero-bench" id="quick-convert">
          <div className="bench-ruler" aria-hidden="true"><span /><span /><span /><span /><span /></div>
          <VectorizeWorkspace compact />
        </div>
      </section>

      <ToolIndex />
      <PrivacyPath />

      <section className="format-guide" aria-labelledby="format-guide-title">
        <div className="format-guide-title">
          <h2 id="format-guide-title">Pick by your machine.</h2>
          <p>Each one wants a different file. Here&apos;s which to make.</p>
        </div>
        <div className="format-notes">
          <article>
            <Icon icon="ph:scissors" width="28" aria-hidden="true" />
            <h3>Cricut &amp; Silhouette</h3>
            <p>Upload an SVG. Use Black &amp; white for one color, or Cut out layers for layered vinyl.</p>
            <Link href="/png-to-svg">PNG to SVG</Link>
          </article>
          <article>
            <Icon icon="ph:lightning" width="28" aria-hidden="true" />
            <h3>Laser &amp; CNC</h3>
            <p>Most laser and CAD software takes DXF. Type the real width and it comes out at that size.</p>
            <Link href="/svg-to-dxf">SVG to DXF</Link>
          </article>
          <article>
            <Icon icon="ph:pen-nib" width="28" aria-hidden="true" />
            <h3>Sketches &amp; signatures</h3>
            <p>Photograph it on white paper and trace it in black and white.</p>
            <Link href="/jpg-to-svg">JPG to SVG</Link>
          </article>
        </div>
      </section>

      <section className="conversion-directory" aria-labelledby="conversions-title">
        <div className="conversion-directory-head">
          <h2 id="conversions-title">Popular conversions.</h2>
          <p>Every format pair runs locally. Pick the one you need.</p>
        </div>
        <div className="conversion-columns">
          <div>
            <h3>Vector &amp; cut files</h3>
            <ul>
              {conversions.filter((c) => c.group === "image" && isVector(c.slug)).map((c) => (
                <li key={c.slug}><Link href={c.slug}>{c.label}<Icon icon="ph:arrow-up-right" width="15" aria-hidden="true" /></Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Images</h3>
            <ul>
              {conversions.filter((c) => c.group === "image" && !isVector(c.slug)).map((c) => (
                <li key={c.slug}><Link href={c.slug}>{c.label}<Icon icon="ph:arrow-up-right" width="15" aria-hidden="true" /></Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Video</h3>
            <ul>
              {conversions.filter((c) => c.group === "video").map((c) => (
                <li key={c.slug}><Link href={c.slug}>{c.label}<Icon icon="ph:arrow-up-right" width="15" aria-hidden="true" /></Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Speech to text</h3>
            <ul>
              {conversions.filter((c) => c.group === "audio").map((c) => (
                <li key={c.slug}><Link href={c.slug}>{c.label}<Icon icon="ph:arrow-up-right" width="15" aria-hidden="true" /></Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
