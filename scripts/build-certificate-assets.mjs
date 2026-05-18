import sharp from "sharp";
import { mkdir, readFile, writeFile, copyFile } from "fs/promises";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public", "certificate");
const refPath = path.join(outDir, "reference-sample.png");
const myCertPath = path.join(
  root,
  "assets",
  "c__Users_HP_Desktop_Projects_darse-quran-academy_my_certificate.png",
);

await mkdir(outDir, { recursive: true });

try {
  await copyFile(myCertPath, path.join(outDir, "design-reference.png"));
} catch {
  // optional
}

const source = await readFile(refPath);
const meta = await sharp(source).metadata();
const W = meta.width ?? 1754;
const H = meta.height ?? 1240;
console.log("Reference size:", W, H);

const cornerSize = Math.round(Math.min(W, H) * 0.22);

async function cropCorner(left, top, name) {
  await sharp(source)
    .extract({ left, top, width: cornerSize, height: cornerSize })
    .png()
    .toFile(path.join(outDir, name));
}

await cropCorner(0, 0, "corner-tl.png");
await cropCorner(W - cornerSize, 0, "corner-tr.png");
await cropCorner(0, H - cornerSize, "corner-bl.png");
await cropCorner(W - cornerSize, H - cornerSize, "corner-br.png");

// Optional: soft mandala (reference has text over the pattern — keep file for manual art only)
const wmW = Math.round(W * 0.2);
const wmH = Math.round(H * 0.48);
await sharp(source)
  .extract({ left: Math.round(W * 0.03), top: Math.round(H * 0.26), width: wmW, height: wmH })
  .ensureAlpha()
  .blur(2)
  .linear(0.35, 80)
  .png()
  .toFile(path.join(outDir, "watermark.png"));

// Footer flourish — crop only the gold rule (no body text above/below)
const flourishW = Math.round(W * 0.22);
await sharp(source)
  .extract({
    left: Math.round(W / 2 - flourishW / 2),
    top: Math.round(H * 0.78),
    width: flourishW,
    height: Math.round(H * 0.025),
  })
  .png()
  .toFile(path.join(outDir, "footer-flourish.png"));

// Signature ink only (exclude printed FOUNDER/CEO label)
await sharp(source)
  .extract({
    left: Math.round(W * 0.54),
    top: Math.round(H * 0.805),
    width: Math.round(W * 0.14),
    height: Math.round(H * 0.055),
  })
  .png()
  .toFile(path.join(outDir, "signature.png"));

// Side flourish (horizontal line with ornament) near logo
const sideW = Math.round(W * 0.2);
const sideBuf = await sharp(source)
  .extract({
    left: Math.round(W * 0.12),
    top: Math.round(H * 0.155),
    width: sideW,
    height: Math.round(H * 0.03),
  })
  .png()
  .toBuffer();
await writeFile(path.join(outDir, "side-flourish.png"), sideBuf);
await sharp(sideBuf).flop().png().toFile(path.join(outDir, "side-flourish-right.png"));

// Build blank template: cream fill + corners + watermark at reduced opacity
const scale = 842 / W;
const pageW = 842;
const pageH = Math.round(H * scale);

const cream = { r: 252, g: 250, b: 245, alpha: 255 };

let template = sharp({
  create: {
    width: pageW,
    height: pageH,
    channels: 4,
    background: cream,
  },
});

const cs = Math.round(cornerSize * scale);
const corners = [
  { file: "corner-tl.png", left: 0, top: 0 },
  { file: "corner-tr.png", left: pageW - cs, top: 0 },
  { file: "corner-bl.png", left: 0, top: pageH - cs },
  { file: "corner-br.png", left: pageW - cs, top: pageH - cs },
];

const composites = [];
for (const c of corners) {
  const buf = await readFile(path.join(outDir, c.file));
  composites.push({ input: buf, left: c.left, top: c.top });
}

// Do not composite watermark — reference sample has text over the mandala (causes ghost overlap)

// Green outer border via sharp is easier in PDF - save template without border
await template.composite(composites).png().toFile(path.join(outDir, "template-base.png"));

console.log("Built certificate assets in public/certificate/");
