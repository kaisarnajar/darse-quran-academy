import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts } from "pdf-lib";

/** Write a small valid PDF under `public/` for local certificate/receipt QA. */
export async function writeDemoPdfFile(publicPath: string, lines: string[]) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([420, 240]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  let y = 200;
  for (const line of lines) {
    page.drawText(line.slice(0, 72), { x: 40, y, size: 12, font });
    y -= 22;
  }

  const bytes = await pdf.save();
  const absolute = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, bytes);
}
