import { readFile } from "fs/promises";
import path from "path";
import {
  PDFDocument,
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

const PAGE_W = 842;
const PAGE_H = 595;

const CREAM = rgb(0.99, 0.98, 0.95);
const DARK_GREEN = rgb(0.1, 0.28, 0.2);
const GOLD = rgb(0.72, 0.55, 0.18);
const GOLD_LIGHT = rgb(0.88, 0.78, 0.55);
const TEXT_GREEN = rgb(0.08, 0.24, 0.16);
const MUTED_GREEN = rgb(0.2, 0.35, 0.28);

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

export function formatCertificateId(enrollmentId: string): string {
  const year = new Date().getFullYear();
  return `DQA-${year}-${enrollmentId.slice(0, 8).toUpperCase()}`;
}

export function formatCertificateIssuanceDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`;
}

/** Subject line in body (e.g. TAJWEED) derived from course title or category */
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

function drawCenteredText(
  page: PDFPage,
  text: string,
  centerY: number,
  size: number,
  font: PDFFont,
  color: RGB,
) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: PAGE_W / 2 - width / 2,
    y: centerY,
    size,
    font,
    color,
  });
}

function drawHorizontalRule(page: PDFPage, centerY: number, halfWidth: number, color: RGB) {
  const cx = PAGE_W / 2;
  const gap = 8;
  page.drawLine({
    start: { x: cx - halfWidth, y: centerY },
    end: { x: cx - gap, y: centerY },
    thickness: 1,
    color,
  });
  page.drawLine({
    start: { x: cx + gap, y: centerY },
    end: { x: cx + halfWidth, y: centerY },
    thickness: 1,
    color,
  });
  const d = 4;
  page.drawLine({ start: { x: cx, y: centerY + d }, end: { x: cx + d, y: centerY }, thickness: 1, color });
  page.drawLine({ start: { x: cx + d, y: centerY }, end: { x: cx, y: centerY - d }, thickness: 1, color });
  page.drawLine({ start: { x: cx, y: centerY - d }, end: { x: cx - d, y: centerY }, thickness: 1, color });
  page.drawLine({ start: { x: cx - d, y: centerY }, end: { x: cx, y: centerY + d }, thickness: 1, color });
}

function drawCornerOrnament(
  page: PDFPage,
  corner: "tl" | "tr" | "bl" | "br",
  inset: number,
  size: number,
) {
  const isTop = corner.startsWith("t");
  const isLeft = corner.endsWith("l");
  const baseX = isLeft ? inset : PAGE_W - inset - size;
  const baseY = isTop ? PAGE_H - inset - size : inset;

  for (let i = 0; i < 4; i += 1) {
    const offset = i * 14;
    const w = size - offset * 0.6;
    const h = 8;
    const x = isLeft ? baseX + offset * 0.3 : baseX + size - w - offset * 0.3;
    const y = isTop ? baseY + size - h - offset * 0.2 : baseY + offset * 0.2;
    page.drawEllipse({
      x: x + w / 2,
      y: y + h / 2,
      xScale: w / 2,
      yScale: h / 2,
      borderColor: GOLD,
      borderWidth: 1,
      color: GOLD_LIGHT,
    });
  }
}

function drawPageFrame(page: PDFPage) {
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: CREAM });

  const outer = 18;
  page.drawRectangle({
    x: outer,
    y: outer,
    width: PAGE_W - outer * 2,
    height: PAGE_H - outer * 2,
    borderColor: DARK_GREEN,
    borderWidth: 10,
  });
  page.drawRectangle({
    x: outer + 12,
    y: outer + 12,
    width: PAGE_W - (outer + 12) * 2,
    height: PAGE_H - (outer + 12) * 2,
    borderColor: GOLD,
    borderWidth: 2,
  });
  page.drawRectangle({
    x: outer + 16,
    y: outer + 16,
    width: PAGE_W - (outer + 16) * 2,
    height: PAGE_H - (outer + 16) * 2,
    borderColor: GOLD,
    borderWidth: 0.5,
  });

  for (const corner of ["tl", "tr", "bl", "br"] as const) {
    drawCornerOrnament(page, corner, 28, 52);
  }

  for (let i = 0; i < 5; i += 1) {
    page.drawCircle({
      x: 95 + i * 8,
      y: PAGE_H * 0.35 + i * 22,
      size: 48 + i * 18,
      borderColor: GOLD_LIGHT,
      borderWidth: 0.5,
    });
  }
}

function drawSideFlourish(page: PDFPage, centerY: number) {
  const half = 200;
  drawHorizontalRule(page, centerY, half, GOLD);
}

function drawCalendarIcon(page: PDFPage, x: number, y: number) {
  page.drawRectangle({
    x,
    y,
    width: 18,
    height: 16,
    borderColor: GOLD,
    borderWidth: 1,
  });
  page.drawLine({
    start: { x, y: y + 12 },
    end: { x: x + 18, y: y + 12 },
    thickness: 1,
    color: GOLD,
  });
  page.drawLine({
    start: { x: x + 5, y: y + 16 },
    end: { x: x + 5, y: y + 18 },
    thickness: 1.5,
    color: GOLD,
  });
  page.drawLine({
    start: { x: x + 13, y: y + 16 },
    end: { x: x + 13, y: y + 18 },
    thickness: 1.5,
    color: GOLD,
  });
}

function drawSignature(page: PDFPage, x: number, y: number, font: PDFFont) {
  const ink = rgb(0.05, 0.05, 0.05);
  const points = [
    { x, y: y + 6 },
    { x: x + 28, y: y + 22 },
    { x: x + 55, y: y + 4 },
    { x: x + 82, y: y + 18 },
    { x: x + 118, y: y + 10 },
  ];
  for (let i = 0; i < points.length - 1; i += 1) {
    page.drawLine({
      start: points[i],
      end: points[i + 1],
      thickness: 1.4,
      color: ink,
    });
  }
  const label = "FOUNDER/CEO";
  page.drawText(label, {
    x: x + 28,
    y: y - 10,
    size: 8,
    font,
    color: TEXT_GREEN,
  });
}

async function embedAcademyLogo(pdfDoc: PDFDocument) {
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const bytes = await readFile(logoPath);
  return pdfDoc.embedPng(bytes);
}

function drawWrappedParagraph(
  page: PDFPage,
  lines: string[],
  startY: number,
  size: number,
  font: PDFFont,
  color: RGB,
  lineHeight: number,
) {
  let y = startY;
  for (const line of lines) {
    drawCenteredText(page, line, y, size, font, color);
    y -= lineHeight;
  }
  return y;
}

function drawMixedCenteredLine(
  page: PDFPage,
  segments: { text: string; bold?: boolean }[],
  y: number,
  size: number,
  serif: PDFFont,
  serifBold: PDFFont,
) {
  const totalWidth = segments.reduce((sum, segment) => {
    const font = segment.bold ? serifBold : serif;
    return sum + font.widthOfTextAtSize(segment.text, size);
  }, 0);
  let x = PAGE_W / 2 - totalWidth / 2;
  for (const segment of segments) {
    const font = segment.bold ? serifBold : serif;
    page.drawText(segment.text, { x, y, size, font, color: TEXT_GREEN });
    x += font.widthOfTextAtSize(segment.text, size);
  }
}

function drawBodyParagraphs(
  page: PDFPage,
  subject: string,
  serif: PDFFont,
  serifBold: PDFFont,
  startY: number,
) {
  const maxWidth = 620;
  const size = 11.5;
  const lineHeight = 16;

  const intro =
    "in recognition and appreciation of their dedication, commitment, and sincere participation in ";
  const linesIntro = wrapText(intro, serif, size, maxWidth);
  let y = startY;
  for (const line of linesIntro) {
    drawCenteredText(page, line, y, size, serif, TEXT_GREEN);
    y -= lineHeight;
  }

  drawMixedCenteredLine(
    page,
    [
      { text: subject, bold: true },
      { text: " learning at " },
      { text: "Darse Quran Academy", bold: true },
      { text: "." },
    ],
    y,
    size,
    serif,
    serifBold,
  );
  y -= lineHeight + 6;

  const para2 =
    "The student has shown admirable effort, discipline, and enthusiasm in the study and recitation of the Holy Quran, reflecting excellent character and devotion to Islamic learning.";
  const lines2 = wrapText(para2, serif, size, maxWidth);
  drawWrappedParagraph(page, lines2, y, size, serif, TEXT_GREEN, lineHeight);
}

export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

  const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  drawPageFrame(page);

  const logo = await embedAcademyLogo(pdfDoc);
  const logoW = 108;
  const logoH = (logo.height / logo.width) * logoW;
  const logoY = PAGE_H - 52 - logoH;
  page.drawImage(logo, {
    x: PAGE_W / 2 - logoW / 2,
    y: logoY,
    width: logoW,
    height: logoH,
  });

  drawSideFlourish(page, logoY + logoH / 2 + 4);

  let y = logoY - 18;
  drawCenteredText(page, "DARSE QURAN ACADEMY", y, 13, serifBold, DARK_GREEN);

  y -= 36;
  drawCenteredText(page, "CERTIFICATE OF APPRECIATION", y, 30, serifBold, GOLD);

  y -= 8;
  drawHorizontalRule(page, y, 120, GOLD);

  y -= 28;
  drawCenteredText(page, "THIS CERTIFICATE IS PROUDLY PRESENTED TO", y, 9, sansBold, MUTED_GREEN);

  y -= 34;
  const studentName = (data.studentName || "Student").toUpperCase();
  drawCenteredText(page, studentName, y, 26, serifBold, DARK_GREEN);

  y -= 30;
  drawCenteredText(page, "RESIDING AT", y, 9, sansBold, MUTED_GREEN);

  y -= 6;
  drawHorizontalRule(page, y, 140, GOLD);

  y -= 26;
  const address = (data.studentAddress?.trim() || "—").toUpperCase();
  const addressSize = address.length > 40 ? 14 : 18;
  drawCenteredText(page, address, y, addressSize, serifBold, DARK_GREEN);

  y -= 36;
  drawBodyParagraphs(page, data.courseSubject.toUpperCase(), serif, serifBold, y);

  const footerY = 72;
  drawCalendarIcon(page, 88, footerY + 6);
  page.drawText("DATE OF ISSUANCE", {
    x: 72,
    y: footerY - 8,
    size: 7.5,
    font: sansBold,
    color: MUTED_GREEN,
  });
  page.drawText(formatCertificateIssuanceDate(data.completedAt), {
    x: 72,
    y: footerY - 24,
    size: 12,
    font: serifBold,
    color: DARK_GREEN,
  });

  drawHorizontalRule(page, footerY + 4, 90, GOLD);

  drawSignature(page, PAGE_W / 2 - 50, footerY - 6, sansBold);

  const sealW = 56;
  const sealH = (logo.height / logo.width) * sealW;
  page.drawImage(logo, {
    x: PAGE_W - 108,
    y: footerY - 8,
    width: sealW,
    height: sealH,
  });

  const certLine = `Certificate ID: ${data.certificateId}`;
  page.drawText(certLine, {
    x: PAGE_W / 2 - sans.widthOfTextAtSize(certLine, 7) / 2,
    y: 38,
    size: 7,
    font: sans,
    color: MUTED_GREEN,
  });

  return pdfDoc.save();
}

export function getCertificateDownloadUrl(enrollmentId: string): string {
  const base = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/api/certificate/${enrollmentId}`;
}
