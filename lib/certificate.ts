import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type CertificateData = {
  studentName: string;
  courseTitle: string;
  completedAt: Date;
  certificateId: string;
};

export function formatCertificateId(enrollmentId: string): string {
  const year = new Date().getFullYear();
  return `DQA-${year}-${enrollmentId.slice(0, 8).toUpperCase()}`;
}

export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const borderColor = rgb(0.22, 0.19, 0.64);
  const accentColor = rgb(0.71, 0.33, 0.04);
  const textColor = rgb(0.11, 0.1, 0.09);
  const mutedColor = rgb(0.34, 0.33, 0.32);

  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor,
    borderWidth: 2,
  });

  page.drawRectangle({
    x: 36,
    y: 36,
    width: width - 72,
    height: height - 72,
    borderColor: accentColor,
    borderWidth: 1,
  });

  const centerX = width / 2;
  let y = height - 100;

  page.drawText("DARSE QURAN ACADEMY", {
    x: centerX - serifBold.widthOfTextAtSize("DARSE QURAN ACADEMY", 14) / 2,
    y,
    size: 14,
    font: serifBold,
    color: borderColor,
  });

  y -= 36;
  page.drawText("Certificate of Completion", {
    x: centerX - serifBold.widthOfTextAtSize("Certificate of Completion", 28) / 2,
    y,
    size: 28,
    font: serifBold,
    color: textColor,
  });

  y -= 48;
  const intro = "This is to certify that";
  page.drawText(intro, {
    x: centerX - serif.widthOfTextAtSize(intro, 16) / 2,
    y,
    size: 16,
    font: serif,
    color: mutedColor,
  });

  y -= 40;
  const name = data.studentName || "Student";
  page.drawText(name, {
    x: centerX - serifBold.widthOfTextAtSize(name, 32) / 2,
    y,
    size: 32,
    font: serifBold,
    color: borderColor,
  });

  y -= 44;
  const hasCompleted = "has successfully completed the course";
  page.drawText(hasCompleted, {
    x: centerX - serif.widthOfTextAtSize(hasCompleted, 16) / 2,
    y,
    size: 16,
    font: serif,
    color: mutedColor,
  });

  y -= 36;
  const titleSize = Math.min(24, Math.max(14, 480 / Math.max(data.courseTitle.length, 1)));
  page.drawText(data.courseTitle, {
    x: centerX - serifBold.widthOfTextAtSize(data.courseTitle, titleSize) / 2,
    y,
    size: titleSize,
    font: serifBold,
    color: accentColor,
  });

  y -= 52;
  const dateStr = data.completedAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const onDate = `Completed on ${dateStr}`;
  page.drawText(onDate, {
    x: centerX - sans.widthOfTextAtSize(onDate, 12) / 2,
    y,
    size: 12,
    font: sans,
    color: mutedColor,
  });

  y -= 28;
  const certLine = `Certificate ID: ${data.certificateId}`;
  page.drawText(certLine, {
    x: centerX - sans.widthOfTextAtSize(certLine, 10) / 2,
    y,
    size: 10,
    font: sans,
    color: mutedColor,
  });

  page.drawText("Authorized by Darse Quran Academy", {
    x: width - 280,
    y: 72,
    size: 11,
    font: sans,
    color: mutedColor,
  });

  page.drawLine({
    start: { x: width - 280, y: 88 },
    end: { x: width - 80, y: 88 },
    thickness: 1,
    color: mutedColor,
  });

  const footer =
    "This is a sample certificate issued for demonstration. Official records are maintained by the academy.";
  page.drawText(footer, {
    x: centerX - sans.widthOfTextAtSize(footer, 8) / 2,
    y: 48,
    size: 8,
    font: sans,
    color: mutedColor,
  });

  return pdfDoc.save();
}

export function getCertificateDownloadUrl(enrollmentId: string): string {
  const base = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/api/certificate/${enrollmentId}`;
}
