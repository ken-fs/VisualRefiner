import type { Metadata } from "next";
import { EraseWorkspace } from "@/components/EraseWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Erase Objects from Photos (Free, No Upload)",
  description: "Paint over an unwanted object, a blemish, or a date stamp and fill the gap with matching surroundings. Runs locally in your browser with OpenCV — your photo never leaves your device.",
  alternates: { canonical: "/erase-object" },
};

export default function EraseObjectPage() {
  return (
    <ToolPageShell
      title="Object eraser"
      description="Paint over the thing you don't want. The gap gets filled from the pixels around it."
      note="Runs locally with OpenCV"
      slug="/erase-object"
      steps={["Choose a photo.", "Paint over the object you want gone.", "Erase it and download the cleaned image."]}
      explainer={
        <>
          <h2 id="learn-title">Good for the stuff that sneaks into shots</h2>
          <p>
            A stranger in the background, a power line across the sky, a date stamp from 2009, a smudge on the
            lens. Paint over it, and the tool rebuilds that patch from the surrounding texture — the same
            inpainting technique photo editors have used for years, running here as OpenCV compiled to WebAssembly.
          </p>
          <h3>Get the best fill</h3>
          <p>
            It shines on <strong>simple, even backgrounds</strong> — sky, walls, grass, skin. On busy patterns or
            straight edges the fill can smear; a smaller brush and several short strokes usually beat one big
            swipe. Large photos are worked on at a reduced resolution for speed, and transparent areas come out
            flattened (opaque).
          </p>
          <h3>One ground rule</h3>
          <p>
            Use it on <strong>your own photos</strong>, or images you have the rights to edit. Cleaning up your
            shot is fine; stripping credit or ownership marks from someone else&apos;s work isn&apos;t.
          </p>
        </>
      }
      faqs={[
        { question: "How does the erasing work?", answer: "You paint a mask over the unwanted area, and an inpainting algorithm (OpenCV's Telea method) fills it in by propagating the surrounding colors and textures inward. It runs as WebAssembly inside your browser tab." },
        { question: "Why does the first erase take a moment?", answer: "The editing engine (about 13 MB of WebAssembly) downloads the first time you use the tool and is cached after that. The actual erasing then happens entirely on your device." },
        { question: "What kind of objects erase cleanly?", answer: "Small to medium objects against even backgrounds — sky, walls, sand, skin — come out best. Complex patterns, faces, and strong straight lines can smear; try a smaller brush and shorter strokes there." },
        { question: "Can I use it to remove watermarks?", answer: "The tool fills any painted region, but please use it on your own images or ones you have rights to edit. Removing ownership marks from other people's content can violate copyright and platform rules." },
        { question: "Is my photo uploaded?", answer: "No. The engine runs locally in your browser — the photo never leaves your device, and the tool works offline once the engine has loaded." },
      ]}
    >
      <EraseWorkspace />
    </ToolPageShell>
  );
}
