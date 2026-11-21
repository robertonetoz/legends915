import fs from "node:fs";
import path from "node:path";

export type WorkCategory = "fades" | "designs" | "kids" | "beards";

export type WorkItem = {
  src: string;
  kind: "image" | "video";
  category: WorkCategory;
  alt: string;
  poster?: string;
};

const IMAGE = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const VIDEO = new Set([".mp4", ".webm", ".mov"]);

const LABEL: Record<WorkCategory, string> = {
  fades: "Fade",
  designs: "Freehand design",
  kids: "Kids cut",
  beards: "Beard work",
};

/**
 * Reads every photo and video dropped into /public/work.
 * The file name prefix sets the filter tab, after an optional order number:
 *   01-design-ghostface.mp4, fade-01.jpg, kids-03.webp, beard-02.jpg
 * A video can have a poster frame with the same name plus ".poster.jpg".
 */
export function getWorkItems(): WorkItem[] {
  const dir = path.join(process.cwd(), "public", "work");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).sort();
  const items: WorkItem[] = [];

  for (const file of files) {
    if (file.includes(".poster.")) continue;
    const ext = path.extname(file).toLowerCase();
    const kind = IMAGE.has(ext) ? "image" : VIDEO.has(ext) ? "video" : null;
    if (!kind) continue;

    // An optional leading number sets the order: "01-design-ghostface.mp4".
    const tokens = file.toLowerCase().split(/[-_.]/);
    const prefix = /^\d+$/.test(tokens[0]) ? (tokens[1] ?? "") : tokens[0];
    const category: WorkCategory = prefix.startsWith("design")
      ? "designs"
      : prefix.startsWith("kid")
        ? "kids"
        : prefix.startsWith("beard")
          ? "beards"
          : "fades";

    const base = file.slice(0, -ext.length);
    const poster = files.find((f) => f.startsWith(`${base}.poster.`));

    items.push({
      src: `/work/${file}`,
      kind,
      category,
      alt: `${LABEL[category]} by Legends Barbershop, El Paso`,
      poster: poster ? `/work/${poster}` : undefined,
    });
  }

  return items;
}
