import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const MAX_RECEIPT_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPE = "application/pdf";

export function validateReceiptPdf(file: File | null): { error?: string } {
  if (!file || file.size === 0) {
    return { error: "Choose a PDF receipt file to upload." };
  }

  if (file.type !== ALLOWED_TYPE) {
    return { error: "Receipt must be a PDF file." };
  }

  if (file.size > MAX_RECEIPT_BYTES) {
    return { error: "Receipt PDF must be 10 MB or smaller." };
  }

  return {};
}

export function receiptUploadPath(paymentRecordId: string) {
  return `/uploads/receipts/${paymentRecordId}.pdf`;
}

export async function deleteUploadedReceipt(publicPath: string | null) {
  if (!publicPath?.startsWith("/uploads/receipts/")) return;

  const absolute = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  try {
    await unlink(absolute);
  } catch {
    // File may already be missing.
  }
}

export async function saveUploadedReceipt(paymentRecordId: string, file: File): Promise<string> {
  const publicPath = receiptUploadPath(paymentRecordId);
  const dir = path.join(process.cwd(), "public", "uploads", "receipts");
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, `${paymentRecordId}.pdf`), buffer);

  return publicPath;
}
