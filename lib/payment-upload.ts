import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_SCREENSHOT_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function validatePaymentScreenshot(file: File | null): { error?: string } {
  if (!file || file.size === 0) {
    return {};
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Screenshot must be a JPEG, PNG, WebP, or GIF image." };
  }

  if (file.size > MAX_SCREENSHOT_BYTES) {
    return { error: "Screenshot must be 2 MB or smaller." };
  }

  return {};
}

export async function savePaymentScreenshot(
  enrollmentId: string,
  file: File,
): Promise<string> {
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";

  const filename = `${enrollmentId}-${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "payments");
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/payments/${filename}`;
}
