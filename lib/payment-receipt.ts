import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type PaymentReceiptData = {
  receiptId: string;
  studentName: string;
  courseTitle: string;
  description: string;
  amountInrPaise: number;
  paidAt: Date;
  paymentMethod: string | null;
  upiTransactionId: string | null;
};

export function formatReceiptId(paymentRecordId: string): string {
  const year = new Date().getFullYear();
  return `DQA-RCP-${year}-${paymentRecordId.slice(0, 8).toUpperCase()}`;
}

/** PDF standard fonts only support WinAnsi — avoid ₹ and other Unicode symbols. */
function formatPriceForPdf(paise: number): string {
  const inr = Math.round(paise / 100);
  return `Rs. ${inr.toLocaleString("en-IN")}`;
}

function sanitizePdfText(text: string): string {
  return text
    .replace(/\u20b9/g, "Rs.")
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/[^\t\n\r\x20-\x7e\xa0-\xff]/g, "");
}

export function getReceiptDownloadUrl(paymentRecordId: string): string {
  const base = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/api/receipt/${paymentRecordId}`;
}

export async function generatePaymentReceiptPdf(data: PaymentReceiptData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const { width, height } = page.getSize();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const primary = rgb(0.22, 0.19, 0.52);
  const muted = rgb(0.4, 0.38, 0.36);
  const gold = rgb(0.71, 0.52, 0.15);

  let y = height - 72;

  page.drawText(sanitizePdfText("Darse Quran Academy"), {
    x: 48,
    y,
    size: 14,
    font: fontBold,
    color: primary,
  });
  y -= 28;
  page.drawText(sanitizePdfText("Payment Receipt"), {
    x: 48,
    y,
    size: 22,
    font: fontBold,
    color: primary,
  });
  y -= 8;
  page.drawLine({
    start: { x: 48, y },
    end: { x: width - 48, y },
    thickness: 1,
    color: gold,
  });
  y -= 32;

  const rows: [string, string][] = [
    ["Receipt no.", data.receiptId],
    ["Student", data.studentName || "-"],
    ["Course", data.courseTitle],
    ["Description", data.description],
    ["Amount", formatPriceForPdf(data.amountInrPaise)],
    [
      "Paid on",
      data.paidAt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    ],
  ];

  if (data.paymentMethod) {
    rows.push(["Payment method", data.paymentMethod.toUpperCase()]);
  }
  if (data.upiTransactionId) {
    rows.push(["Reference / UTR", data.upiTransactionId]);
  }

  for (const [label, value] of rows) {
    page.drawText(sanitizePdfText(label), { x: 48, y, size: 10, font: fontBold, color: muted });
    y -= 16;
    const lines = wrapText(sanitizePdfText(value), 70);
    for (const line of lines) {
      page.drawText(line, { x: 48, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
      y -= 18;
    }
    y -= 8;
  }

  y -= 12;
  page.drawText(
    sanitizePdfText("This receipt confirms payment received by Darse Quran Academy."),
    {
    x: 48,
    y,
    size: 9,
    font,
    color: muted,
    },
  );

  return pdf.save();
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : ["-"];
}

export function getReceiptFilename(courseTitle: string, paymentRecordId: string): string {
  const slug = courseTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
  return `receipt-${slug || "payment"}-${paymentRecordId.slice(0, 8)}.pdf`;
}
