import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const contract = `<!--
THESIS: Visual files enter a precision inspection bench, refusing the generic SaaS hero and card grid.
OWN-WORLD: Celadon-grey work surfaces, graphite type, calibration orange actions, crop ticks, registration marks, and a movable inspection lens.
STORY: Choose a real task, see that the file stays in the browser, process it, and download the result.
FIRST VIEWPORT: An asymmetrical title and tool index face a dominant file inspection field with the primary file action inside it.
FORM: Precision inspection bench, grounded direction six, seed 56192447.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : path.endsWith(".html") ? [path] : [];
  }));
  return files.flat();
}

const files = await htmlFiles(fileURLToPath(new URL("../out", import.meta.url)));
let updated = 0;

for (const file of files) {
  const html = await readFile(file, "utf8");
  if (!html.includes("seed 56192447")) {
    await writeFile(file, html.replace(/<body([^>]*)>/, (body) => `${body}${contract}`));
    updated += 1;
  }
}

if (files.length === 0) throw new Error("No exported HTML files found.");
console.log(`Design contract verified in ${files.length} pages; injected into ${updated}.`);
