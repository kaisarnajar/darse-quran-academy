import { readFile } from "fs/promises";
import path from "path";
import {
  PDFDocument,
  type PDFImage,
  type PDFPage,
  type PDFFont,
  type RGB,
  rgb,
  StandardFonts,
} from "pdf-lib";

export type CertificateData = {
  studentName: string;
  studentAddress: string | null;
  courseTitle: string;
  courseSubject: string;
  completedAt: Date;
  certificateId: string;
};

/** Landscape — matches reference aspect (1024×682 scaled) */
const PAGE_W = 842;
const PAGE_H = 595;

const CREAM = rgb(0.99, 0.98, 0.95);
const DARK_GREEN = rgb(0.08, 0.26, 0.17);
const GOLD = rgb(0.71, 0.52, 0.15);
const TEXT_GREEN = rgb(0.06, 0.22, 0.14);
const MUTED_GREEN = rgb(0.18, 0.34, 0.26);

/** Text column inside corner ornaments */
const TEXT_LEFT = 148;
const TEXT_RIGHT = PAGE_W - 148;
const TEXT_WIDTH = TEXT_RIGHT - TEXT_LEFT;

/** Footer band — body must stay above this baseline */
const FOOTER_BAND_TOP = 168;
const FOOTER_RULE_Y = 158;

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

const CERT_DIR = path.join(process.cwd(), "public", "certificate");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export function formatCertificateId(enrollmentId: string): string {
  const year = new Date().getFullYear();
  return `DQA-${year}-${enrollmentId.slice(0, 8).toUpperCase()}`;
}

export function formatCertificateIssuanceDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`;
}

export function getCertificateCourseSubject(course: { title: string; category: string }): string {
  const upper = course.title.toUpperCase();
  const keywords = ["TAJWEED", "TAJWID", "QURAN", "HIFZ", "HIFDH", "ARABIC", "FIQH", "HADITH"];
  for (const word of keywords) {
    if (upper.includes(word)) return word === "TAJWID" ? "TAJWEED" : word;
  }
  const category = course.category.trim();
  if (category) return category.toUpperCase();
  return course.title.toUpperCase();
}

type Fonts = {
  serif: PDFFont;
  serifBold: PDFFont;
  sansBold: PDFFont;
};

class Layout {
  y: number;

  constructor(startY: number) {
    this.y = startY;
  }

  baseline(): number {
    return this.y;
  }

  nextLine(size: number, gap = 8): void {
    this.y -= size + gap;
  }

  reserve(blockHeight: number): boolean {
    return this.y - blockHeight >= FOOTER_BAND_TOP;
  }
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [text];
}

function fitFontSize(
  text: string,
  font: PDFFont,
  maxWidth: number,
  startSize: number,
  minSize: number,
): number {
  let size = startSize;
  while (size > minSize && font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 0.5;
  }
  return size;
}

function drawCenteredInColumn(
  page: PDFPage,
  text: string,
  baselineY: number,
  size: number,
  font: PDFFont,
  color: RGB,
): void {
  const textW = font.widthOfTextAtSize(text, size);
  const x = TEXT_LEFT + (TEXT_WIDTH - textW) / 2;
  page.drawText(text, { x, y: baselineY, size, font, color });
}

function drawCenteredLines(
  page: PDFPage,
  lines: string[],
  startBaseline: number,
  size: number,
  font: PDFFont,
  color: RGB,
  lineGap = 7,
): number {
  let y = startBaseline;
  const lineH = size + lineGap;
  for (const line of lines) {
    drawCenteredInColumn(page, line, y, size, font, color);
    y -= lineH;
  }
  return y;
}

function drawHorizontalRule(page: PDFPage, centerY: number, halfWidth: number) {
  const cx = PAGE_W / 2;
  const gap = 7;
  page.drawLine({
    start: { x: cx - halfWidth, y: centerY },
    end: { x: cx - gap, y: centerY },
    thickness: 0.8,
    color: GOLD,
  });
  page.drawLine({
    start: { x: cx + gap, y: centerY },
    end: { x: cx + halfWidth, y: centerY },
    thickness: 0.8,
    color: GOLD,
  });
  const d = 3.5;
  page.drawLine({ start: { x: cx, y: centerY + d }, end: { x: cx + d, y: centerY }, thickness: 0.8, color: GOLD });
  page.drawLine({ start: { x: cx + d, y: centerY }, end: { x: cx, y: centerY - d }, thickness: 0.8, color: GOLD });
  page.drawLine({ start: { x: cx, y: centerY - d }, end: { x: cx - d, y: centerY }, thickness: 0.8, color: GOLD });
  page.drawLine({ start: { x: cx - d, y: centerY }, end: { x: cx, y: centerY + d }, thickness: 0.8, color: GOLD });
}

function drawCornerAccents(page: PDFPage) {
  const len = 36;
  const inset = 28;
  const corners: [number, number, number, number][] = [
    [inset, PAGE_H - inset, inset + len, PAGE_H - inset],
    [inset, PAGE_H - inset, inset, PAGE_H - inset - len],
    [PAGE_W - inset, PAGE_H - inset, PAGE_W - inset - len, PAGE_H - inset],
    [PAGE_W - inset, PAGE_H - inset, PAGE_W - inset, PAGE_H - inset - len],
    [inset, inset, inset + len, inset],
    [inset, inset, inset, inset + len],
    [PAGE_W - inset, inset, PAGE_W - inset - len, inset],
    [PAGE_W - inset, inset, PAGE_W - inset, inset + len],
  ];
  for (const [x1, y1, x2, y2] of corners) {
    page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: 2.2, color: GOLD });
  }
}

function drawPageFrame(page: PDFPage) {
  const inset = 14;
  const borderW = 8;
  page.drawRectangle({
    x: inset,
    y: inset,
    width: PAGE_W - inset * 2,
    height: PAGE_H - inset * 2,
    borderColor: DARK_GREEN,
    borderWidth: borderW,
  });
  const inner = inset + borderW + 2;
  page.drawRectangle({
    x: inner,
    y: inner,
    width: PAGE_W - inner * 2,
    height: PAGE_H - inner * 2,
    borderColor: GOLD,
    borderWidth: 1,
  });
  drawCornerAccents(page);
}

function drawCalendarIcon(page: PDFPage, x: number, y: number) {
  page.drawRectangle({ x, y, width: 15, height: 13, borderColor: GOLD, borderWidth: 0.8 });
  page.drawLine({
    start: { x, y: y + 9 },
    end: { x: x + 15, y: y + 9 },
    thickness: 0.8,
    color: GOLD,
  });
}

function drawMixedLine(
  page: PDFPage,
  segments: { text: string; bold?: boolean }[],
  baselineY: number,
  size: number,
  fonts: Fonts,
): void {
  const totalW = segments.reduce(
    (sum, s) =>
      sum + (s.bold ? fonts.serifBold : fonts.serif).widthOfTextAtSize(s.text, size),
    0,
  );
  let x = TEXT_LEFT + (TEXT_WIDTH - totalW) / 2;
  for (const s of segments) {
    const font = s.bold ? fonts.serifBold : fonts.serif;
    page.drawText(s.text, { x, y: baselineY, size, font, color: TEXT_GREEN });
    x += font.widthOfTextAtSize(s.text, size);
  }
}

function drawBody(
  page: PDFPage,
  subject: string,
  fonts: Fonts,
  layout: Layout,
): void {
  const size = 9.5;
  const lineH = size + 10;

  const intro =
    "in recognition and appreciation of their dedication, commitment, and sincere participation in ";
  for (const line of wrapText(intro, fonts.serif, size, TEXT_WIDTH)) {
    if (!layout.reserve(lineH)) return;
    drawCenteredInColumn(page, line, layout.baseline(), size, fonts.serif, TEXT_GREEN);
    layout.nextLine(size, 8);
  }

  if (layout.reserve(lineH)) {
    drawMixedLine(
      page,
      [
        { text: subject, bold: true },
        { text: " learning at " },
        { text: "Darse Quran Academy", bold: true },
        { text: "." },
      ],
      layout.baseline(),
      size,
      fonts,
    );
    layout.nextLine(size, 8);
  }

  const para2 =
    "The student has shown admirable effort, discipline, and enthusiasm in the study and recitation of the Holy Quran, reflecting excellent character and devotion to Islamic learning.";
  for (const line of wrapText(para2, fonts.serif, size, TEXT_WIDTH)) {
    if (!layout.reserve(lineH)) return;
    drawCenteredInColumn(page, line, layout.baseline(), size, fonts.serif, TEXT_GREEN);
    layout.nextLine(size, 8);
  }
}

function drawInkSignature(page: PDFPage, x: number, y: number) {
  const ink = rgb(0.05, 0.05, 0.05);
  const pts = [
    { x, y: y + 4 },
    { x: x + 22, y: y + 18 },
    { x: x + 48, y: y + 2 },
    { x: x + 72, y: y + 14 },
  ];
  for (let i = 0; i < pts.length - 1; i += 1) {
    page.drawLine({
      start: pts[i],
      end: pts[i + 1],
      thickness: 1.2,
      color: ink,
    });
  }
}

function drawFooter(
  page: PDFPage,
  logo: PDFImage,
  signature: PDFImage | null,
  completedAt: Date,
  fonts: Fonts,
) {
  drawHorizontalRule(page, FOOTER_RULE_Y, 95);

  const dateX = 62;
  const dateBaseY = 54;
  drawCalendarIcon(page, dateX, dateBaseY + 16);
  page.drawText("DATE OF ISSUANCE", {
    x: dateX - 2,
    y: dateBaseY + 4,
    size: 6.5,
    font: fonts.sansBold,
    color: MUTED_GREEN,
  });
  page.drawText(formatCertificateIssuanceDate(completedAt), {
    x: dateX - 2,
    y: dateBaseY - 12,
    size: 10.5,
    font: fonts.serifBold,
    color: DARK_GREEN,
  });

  const sigCenterX = PAGE_W / 2 + 28;
  const sigW = 86;
  const sigBottomY = 62;
  let sigBlockH = 20;
  if (signature) {
    sigBlockH = (signature.height / signature.width) * sigW;
    page.drawImage(signature, {
      x: sigCenterX - sigW / 2,
      y: sigBottomY,
      width: sigW,
      height: sigBlockH,
    });
  } else {
    drawInkSignature(page, sigCenterX - 36, sigBottomY);
  }

  const label = "FOUNDER/CEO";
  const labelW = fonts.sansBold.widthOfTextAtSize(label, 7);
  page.drawText(label, {
    x: sigCenterX - labelW / 2,
    y: sigBottomY - 14,
    size: 7,
    font: fonts.sansBold,
    color: TEXT_GREEN,
  });

  const sealW = 52;
  const sealH = (logo.height / logo.width) * sealW;
  page.drawImage(logo, {
    x: PAGE_W - 82,
    y: 50,
    width: sealW,
    height: sealH,
  });
}

async function loadOptionalPng(pdfDoc: PDFDocument, filePath: string): Promise<PDFImage | null> {
  try {
    return await pdfDoc.embedPng(await readFile(filePath));
  } catch {
    return null;
  }
}

async function loadImages(pdfDoc: PDFDocument) {
  const emblemPath = path.join(PUBLIC_DIR, "icon-512.png");
  const logoPath = path.join(PUBLIC_DIR, "logo.png");
  let emblem: PDFImage;
  try {
    emblem = await pdfDoc.embedPng(await readFile(emblemPath));
  } catch {
    emblem = await pdfDoc.embedPng(await readFile(logoPath));
  }
  const logo = await pdfDoc.embedPng(await readFile(logoPath));
  const signature = await loadOptionalPng(pdfDoc, path.join(CERT_DIR, "signature.png"));
  return { emblem, logo, signature };
}

export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

  const fonts: Fonts = {
    serif: await pdfDoc.embedFont(StandardFonts.TimesRoman),
    serifBold: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
    sansBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
  };

  const { emblem, logo, signature } = await loadImages(pdfDoc);

  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: CREAM });
  drawPageFrame(page);

  const layout = new Layout(PAGE_H - 32);

  const emblemW = 58;
  const emblemH = (emblem.height / emblem.width) * emblemW;
  layout.y -= emblemH;
  page.drawImage(emblem, {
    x: PAGE_W / 2 - emblemW / 2,
    y: layout.y,
    width: emblemW,
    height: emblemH,
  });
  layout.nextLine(0, 10);

  const academy = "DARSE QURAN ACADEMY";
  const academySize = 11;
  drawCenteredInColumn(page, academy, layout.baseline(), academySize, fonts.serifBold, DARK_GREEN);
  layout.nextLine(academySize, 12);

  const titleSize = 22;
  drawCenteredInColumn(
    page,
    "CERTIFICATE OF APPRECIATION",
    layout.baseline(),
    titleSize,
    fonts.serifBold,
    GOLD,
  );
  layout.nextLine(titleSize, 10);

  layout.nextLine(0, 6);
  drawHorizontalRule(page, layout.baseline(), 88);
  layout.nextLine(0, 16);

  const small = 7.5;
  drawCenteredInColumn(
    page,
    "THIS CERTIFICATE IS PROUDLY PRESENTED TO",
    layout.baseline(),
    small,
    fonts.sansBold,
    MUTED_GREEN,
  );
  layout.nextLine(small, 16);

  const name = (data.studentName || "Student").toUpperCase();
  const nameSize = fitFontSize(name, fonts.serifBold, TEXT_WIDTH, 19, 12);
  drawCenteredInColumn(page, name, layout.baseline(), nameSize, fonts.serifBold, DARK_GREEN);
  layout.nextLine(nameSize, 18);

  drawCenteredInColumn(page, "RESIDING AT", layout.baseline(), small, fonts.sansBold, MUTED_GREEN);
  layout.nextLine(small, 10);

  layout.nextLine(0, 4);
  drawHorizontalRule(page, layout.baseline(), 105);
  layout.nextLine(0, 12);

  const address = (data.studentAddress?.trim() || "—").toUpperCase();
  const addressLines = wrapText(address, fonts.serifBold, 14, TEXT_WIDTH);
  const addressSize =
    addressLines.length > 1
      ? fitFontSize(address, fonts.serifBold, TEXT_WIDTH, 13, 9)
      : fitFontSize(address, fonts.serifBold, TEXT_WIDTH, 15, 10);
  const addressEndY = drawCenteredLines(
    page,
    addressLines,
    layout.baseline(),
    addressSize,
    fonts.serifBold,
    DARK_GREEN,
    6,
  );
  layout.y = addressEndY - 18;

  layout.nextLine(0, 4);
  drawHorizontalRule(page, layout.baseline(), 105);
  layout.nextLine(0, 14);

  if (layout.y > FOOTER_BAND_TOP + 20) {
    drawBody(page, data.courseSubject.toUpperCase(), fonts, layout);
  }

  drawFooter(page, logo, signature, data.completedAt, fonts);

  return pdfDoc.save();
}

export function getCertificateDownloadUrl(enrollmentId: string): string {
  const base = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/api/certificate/${enrollmentId}`;
}
