"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import {
  getCourseAnnouncementAttachmentFile,
  parseCourseAnnouncementForm,
  revalidateCourseAnnouncementPaths,
  resolveCourseAnnouncementAttachment,
} from "@/lib/course-announcement-mutations";
import {
  deleteAnnouncementAttachment,
  saveAnnouncementAttachment,
  validateAnnouncementAttachment,
} from "@/lib/announcement-upload";
import { getCourseById } from "@/lib/courses";
import { prisma } from "@/lib/prisma";

function announcementFormPath(courseId: string, suffix = "") {
  return `/admin/courses/${courseId}/announcements${suffix}`;
}

async function requireAdminCourse(courseId: string) {
  await requireAdmin();
  const course = await getCourseById(courseId);
  if (!course) {
    redirect("/admin/courses");
  }
  return course;
}

function adminAuthorName(session: Awaited<ReturnType<typeof requireAdmin>>) {
  const name = session.user?.name?.trim();
  return name ? `${name} (Admin)` : "Academy Admin";
}

export async function createAdminCourseAnnouncement(courseId: string, formData: FormData) {
  const session = await requireAdmin();
  await requireAdminCourse(courseId);
  const parsed = parseCourseAnnouncementForm(formData);

  if (!parsed.success) {
    redirect(
      `${announcementFormPath(courseId, "/new")}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`,
    );
  }

  const upload = getCourseAnnouncementAttachmentFile(formData);
  if (upload) {
    const validation = validateAnnouncementAttachment(upload);
    if (validation.error) {
      redirect(
        `${announcementFormPath(courseId, "/new")}?error=${encodeURIComponent(validation.error)}`,
      );
    }
  }

  const announcement = await prisma.courseAnnouncement.create({
    data: {
      courseId,
      teacherId: null,
      authorName: adminAuthorName(session),
      postedByAdmin: true,
      category: parsed.data.category,
      title: parsed.data.title,
      body: parsed.data.body,
    },
  });

  if (upload) {
    const saved = await saveAnnouncementAttachment(announcement.id, upload);
    await prisma.courseAnnouncement.update({
      where: { id: announcement.id },
      data: saved,
    });
  }

  revalidateCourseAnnouncementPaths(courseId);
  redirect(`${announcementFormPath(courseId)}?posted=1`);
}

export async function updateAdminCourseAnnouncement(
  courseId: string,
  announcementId: string,
  formData: FormData,
) {
  await requireAdmin();
  await requireAdminCourse(courseId);
  const parsed = parseCourseAnnouncementForm(formData);

  if (!parsed.success) {
    redirect(
      `${announcementFormPath(courseId, `/${announcementId}/edit`)}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`,
    );
  }

  const existing = await prisma.courseAnnouncement.findFirst({
    where: { id: announcementId, courseId },
  });
  if (!existing) {
    redirect(`${announcementFormPath(courseId)}?error=notfound`);
  }

  const attachmentUpdate = await resolveCourseAnnouncementAttachment(formData, announcementId, existing);
  if (attachmentUpdate && "error" in attachmentUpdate) {
    redirect(
      `${announcementFormPath(courseId, `/${announcementId}/edit`)}?error=${encodeURIComponent(attachmentUpdate.error)}`,
    );
  }

  await prisma.courseAnnouncement.update({
    where: { id: announcementId },
    data: {
      category: parsed.data.category,
      title: parsed.data.title,
      body: parsed.data.body,
      ...(attachmentUpdate && !("error" in attachmentUpdate) ? attachmentUpdate : {}),
    },
  });

  revalidateCourseAnnouncementPaths(courseId);
  redirect(`${announcementFormPath(courseId)}?saved=1`);
}

export async function deleteAdminCourseAnnouncement(courseId: string, announcementId: string) {
  await requireAdmin();
  await requireAdminCourse(courseId);

  const existing = await prisma.courseAnnouncement.findFirst({
    where: { id: announcementId, courseId },
  });
  if (!existing) {
    redirect(`${announcementFormPath(courseId)}?error=notfound`);
  }

  await deleteAnnouncementAttachment(existing.attachmentPath);
  await prisma.courseAnnouncement.delete({ where: { id: announcementId } });

  revalidateCourseAnnouncementPaths(courseId);
  redirect(`${announcementFormPath(courseId)}?deleted=1`);
}
