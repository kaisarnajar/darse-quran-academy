"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireTeacher } from "@/lib/auth-actions";
import {
  deleteAnnouncementAttachment,
  saveAnnouncementAttachment,
  validateAnnouncementAttachment,
} from "@/lib/announcement-upload";
import { getTeacherCourseForPortal } from "@/lib/teacher-portal";
import { prisma } from "@/lib/prisma";
import { courseAnnouncementSchema } from "@/lib/validations";

function announcementFormPath(courseId: string, suffix = "") {
  return `/teacher/courses/${courseId}/announcements${suffix}`;
}

function parseAnnouncementForm(formData: FormData) {
  return courseAnnouncementSchema.safeParse({
    category: formData.get("category"),
    title: formData.get("title"),
    body: formData.get("body"),
  });
}

function getAttachmentFile(formData: FormData): File | null {
  const raw = formData.get("attachment");
  if (raw instanceof File && raw.size > 0) return raw;
  return null;
}

async function requireTeacherCourse(courseId: string) {
  const { teacher } = await requireTeacher();
  const course = await getTeacherCourseForPortal(teacher.id, courseId);
  if (!course) {
    redirect("/teacher");
  }
  return { teacher, course };
}

type AttachmentFieldUpdate = {
  attachmentPath: string | null;
  attachmentName: string | null;
};

async function resolveAttachmentFields(
  formData: FormData,
  announcementId: string,
  existing?: { attachmentPath: string | null; attachmentName: string | null },
): Promise<AttachmentFieldUpdate | { error: string } | undefined> {
  const upload = getAttachmentFile(formData);
  const remove = formData.get("removeAttachment") === "1";

  if (upload) {
    const validation = validateAnnouncementAttachment(upload);
    if (validation.error) return { error: validation.error };
    if (existing?.attachmentPath) {
      await deleteAnnouncementAttachment(existing.attachmentPath);
    }
    const saved = await saveAnnouncementAttachment(announcementId, upload);
    return saved;
  }

  if (remove && existing?.attachmentPath) {
    await deleteAnnouncementAttachment(existing.attachmentPath);
    return { attachmentPath: null, attachmentName: null };
  }

  return undefined;
}

export async function createCourseAnnouncement(courseId: string, formData: FormData) {
  const { teacher } = await requireTeacherCourse(courseId);
  const parsed = parseAnnouncementForm(formData);

  if (!parsed.success) {
    redirect(
      `${announcementFormPath(courseId, "/new")}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`,
    );
  }

  const upload = getAttachmentFile(formData);
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
      teacherId: teacher.id,
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

  revalidatePath(announcementFormPath(courseId));
  revalidatePath(`/profile/courses/${courseId}/announcements`);
  redirect(`${announcementFormPath(courseId)}?posted=1`);
}

export async function updateCourseAnnouncement(
  courseId: string,
  announcementId: string,
  formData: FormData,
) {
  await requireTeacherCourse(courseId);
  const parsed = parseAnnouncementForm(formData);

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

  const attachmentUpdate = await resolveAttachmentFields(formData, announcementId, existing);
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

  revalidatePath(announcementFormPath(courseId));
  revalidatePath(`/profile/courses/${courseId}/announcements`);
  redirect(`${announcementFormPath(courseId)}?saved=1`);
}

export async function deleteCourseAnnouncement(courseId: string, announcementId: string) {
  await requireTeacherCourse(courseId);

  const existing = await prisma.courseAnnouncement.findFirst({
    where: { id: announcementId, courseId },
  });
  if (!existing) {
    redirect(`${announcementFormPath(courseId)}?error=notfound`);
  }

  await deleteAnnouncementAttachment(existing.attachmentPath);
  await prisma.courseAnnouncement.delete({ where: { id: announcementId } });

  revalidatePath(announcementFormPath(courseId));
  revalidatePath(`/profile/courses/${courseId}/announcements`);
  redirect(`${announcementFormPath(courseId)}?deleted=1`);
}
