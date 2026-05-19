import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function validateSiteAnnouncementImage(file: File | null): { error?: string } {
  if (!file || file.size === 0) {
    return {};
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Photo must be a JPEG, PNG, WebP, or GIF image." };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Photo must be 5 MB or smaller." };
  }

  return {};
}

export async function saveSiteAnnouncementImage(
  announcementId: string,
  file: File,
): Promise<string> {
  const ext = EXT_BY_TYPE[file.type] ?? "jpg";
  const storedName = `${announcementId}-${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "site-announcements");
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, storedName), buffer);

  return `/uploads/site-announcements/${storedName}`;
}

export async function deleteSiteAnnouncementImage(imagePath: string | null | undefined) {
  if (!imagePath || !imagePath.startsWith("/uploads/site-announcements/")) {
    return;
  }

  const filePath = path.join(process.cwd(), "public", imagePath);
  try {
    await unlink(filePath);
  } catch {
    // File may already be missing.
  }
}
