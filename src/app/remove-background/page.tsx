import type { Metadata } from "next";
import { RemoveBackgroundWorkspace } from "@/components/RemoveBackgroundWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Remove Background from Image (Free, No Upload)",
  description:
    "Cut out the subject of a photo and export it with a transparent or clean white background — plus optional soft shadow and floor reflection. Runs locally in your browser; the photo never leaves your device.",
  alternates: { canonical: "/remove-background" },
};

export default function RemoveBackgroundPage() {
  return (
    <ToolPageShell
      title="Background remover"
      description="Cut out the subject and keep it on transparency or a clean white background — with an optional soft shadow and floor reflection for product shots."
      note="Runs locally with an on-device AI model"
      slug="/remove-background"
      steps={[
        "Choose a photo.",
        "Remove the background — the AI model detects the subject.",
        "Pick transparent or white, add a shadow or reflection if you like, and download the PNG.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">Product-photo ready, without Photoshop</h2>
          <p>
            Marketplaces like Amazon mostly require a <strong>pure white background</strong> for main product
            images, and social posts look better with a clean cutout. This tool runs the open RMBG-1.4
            segmentation model — the same class of model paid removers use — as WebAssembly/WebGPU inside your
            tab, so nothing is ever uploaded.
          </p>
          <h3>Shadows and reflections</h3>
          <p>
            A plain cutout can look pasted on. The optional <strong>soft drop shadow</strong> grounds the object
            on a white background, and the <strong>floor reflection</strong> mirrors the bottom of the product
            with a fade — the classic ecommerce look, done with canvas pixels rather than filters you wait on.
          </p>
          <h3>Get the cleanest cut</h3>
          <p>
            Sharp edges with decent contrast work best — products, people, pets, objects. Fine hair, glass, and
            motion blur are the hard cases for any segmentation model. If the first pass isn&apos;t perfect, a
            higher-resolution source usually helps more than a second click.
          </p>
        </>
      }
      faqs={[
        {
          question: "Is my photo uploaded to a server?",
          answer:
            "No. The segmentation model (about 44 MB) downloads once and then runs entirely in your browser — the photo never leaves your device, and the tool works offline after the first run.",
        },
        {
          question: "Which background should I pick?",
          answer:
            "Transparent (PNG) is the flexible choice for design work and social posts. White matches the main-image requirements of Amazon and most marketplaces; add the soft shadow or reflection for a studio look.",
        },
        {
          question: "What image does the model handle best?",
          answer:
            "Clear subjects with decent contrast: products, people, pets, cars, food. Fine hair, transparent glass, and busy edges are the hardest; a sharper, higher-resolution photo improves the edge.",
        },
        {
          question: "What format do I get back?",
          answer:
            "A PNG at your photo's original resolution, with transparency preserved when you pick the transparent background.",
        },
        {
          question: "Can I use this for Amazon product images?",
          answer:
            "Yes — choose the white background for the pure-white main-image look, and pair it with the Social size resizer to export the exact 2000×2000 pixels Amazon recommends.",
        },
      ]}
    >
      <RemoveBackgroundWorkspace />
    </ToolPageShell>
  );
}
