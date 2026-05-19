"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { prisma } from "@/lib/prisma";
import {
  deleteSiteAnnouncementImage,
  saveSiteAnnouncementImage,
  validateSiteAnnouncementImage,
} from "@/lib/site-announcement-upload";
import { siteAnnouncementSchema } from "@/lib/validations";

function adminListPath(query = "") {
  return `/admin/announcements${query}`;
}

function parseSiteAnnouncementForm(formData: FormData) {
  return siteAnnouncementSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    eventDate: formData.get("eventDate") ?? "",
    location: formData.get("location") ?? "",
    showOnHomepage: formData.get("showOnHomepage") === "on",
    published: formData.get("published") === "on",
  });
}

function getImageFile(formData: FormData): File | null {
  const raw = formData.get("image");
  if (raw instanceof File && raw.size > 0) return raw;
  return null;
}

async function resolveImageUpdate(
  formData: FormData,
  announcementId: string,
  existingImagePath: string | null,
): Promise<{ imagePath: string | null } | { error: string } | undefined> {
  const upload = getImageFile(formData);
  const remove = formData.get("removeImage") === "on";

  if (upload) {
    const validation = validateSiteAnnouncementImage(upload);
    if (validation.error) return { error: validation.error };
    if (existingImagePath) await deleteSiteAnnouncementImage(existingImagePath);
    const imagePath = await saveSiteAnnouncementImage(announcementId, upload);
    return { imagePath };
  }

  if (remove && existingImagePath) {
    await deleteSiteAnnouncementImage(existingImagePath);
    return { imagePath: null };
  }

  return undefined;
}

export async function createSiteAnnouncement(formData: FormData) {
  const session = await requireAdmin();
  const parsed = parseSiteAnnouncementForm(formData);

  if (!parsed.success) {
    redirect(
      `${adminListPath("/new")}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`,
    );
  }

  const upload = getImageFile(formData);
  if (upload) {
    const validation = validateSiteAnnouncementImage(upload);
    if (validation.error) {
      redirect(`${adminListPath("/new")}?error=${encodeURIComponent(validation.error)}`);
    }
  }

  const announcement = await prisma.siteAnnouncement.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      eventDate: parsed.data.eventDate || null,
      location: parsed.data.location || null,
      showOnHomepage: parsed.data.showOnHomepage,
      published: parsed.data.published,
      createdById: session.user.id,
    },
  });

  if (upload) {
    const imagePath = await saveSiteAnnouncementImage(announcement.id, upload);
    await prisma.siteAnnouncement.update({
      where: { id: announcement.id },
      data: { imagePath },
    });
  }

  revalidateSiteAnnouncementPaths();
  redirect(`${adminListPath()}?posted=1`);
}

export async function updateSiteAnnouncement(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseSiteAnnouncementForm(formData);

  if (!parsed.success) {
    redirect(
      `${adminListPath(`/${id}/edit`)}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`,
    );
  }

  const existing = await prisma.siteAnnouncement.findUnique({ where: { id } });
  if (!existing) {
    redirect(`${adminListPath()}?error=notfound`);
  }

  const imageUpdate = await resolveImageUpdate(formData, id, existing.imagePath);
  if (imageUpdate && "error" in imageUpdate) {
    redirect(`${adminListPath(`/${id}/edit`)}?error=${encodeURIComponent(imageUpdate.error)}`);
  }

  await prisma.siteAnnouncement.update({
    where: { id },
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      eventDate: parsed.data.eventDate || null,
      location: parsed.data.location || null,
      showOnHomepage: parsed.data.showOnHomepage,
      published: parsed.data.published,
      ...(imageUpdate && !("error" in imageUpdate) ? { imagePath: imageUpdate.imagePath } : {}),
    },
  });

  revalidateSiteAnnouncementPaths();
  redirect(`${adminListPath()}?saved=1`);
}

export async function deleteSiteAnnouncement(id: string) {
  await requireAdmin();

  const existing = await prisma.siteAnnouncement.findUnique({ where: { id } });
  if (!existing) {
    redirect(`${adminListPath()}?error=notfound`);
  }

  await deleteSiteAnnouncementImage(existing.imagePath);
  await prisma.siteAnnouncement.delete({ where: { id } });

  revalidateSiteAnnouncementPaths();
  redirect(`${adminListPath()}?deleted=1`);
}

function revalidateSiteAnnouncementPaths() {
  revalidatePath("/");
  revalidatePath("/announcements");
  revalidatePath("/admin/announcements");
}
