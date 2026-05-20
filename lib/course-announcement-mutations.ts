import { revalidatePath } from "next/cache";
import {
  deleteAnnouncementAttachment,
  saveAnnouncementAttachment,
  validateAnnouncementAttachment,
} from "@/lib/announcement-upload";
import { courseAnnouncementSchema } from "@/lib/validations";

export function parseCourseAnnouncementForm(formData: FormData) {
  return courseAnnouncementSchema.safeParse({
    category: formData.get("category"),
    title: formData.get("title"),
    body: formData.get("body"),
  });
}

export function getCourseAnnouncementAttachmentFile(formData: FormData): File | null {
  const raw = formData.get("attachment");
  if (raw instanceof File && raw.size > 0) return raw;
  return null;
}

export function revalidateCourseAnnouncementPaths(courseId: string) {
  revalidatePath(`/teacher/courses/${courseId}/announcements`);
  revalidatePath(`/admin/courses/${courseId}/announcements`);
  revalidatePath(`/profile/courses/${courseId}/announcements`);
}

export function revalidateStudentAnnouncementPaths(courseId: string, enrollmentId: string) {
  revalidatePath(`/teacher/courses/${courseId}/students/${enrollmentId}/announcements`);
  revalidatePath(`/profile/courses/${courseId}/announcements`);
}

type AttachmentFieldUpdate = {
  attachmentPath: string | null;
  attachmentName: string | null;
};

export async function resolveCourseAnnouncementAttachment(
  formData: FormData,
  announcementId: string,
  existing?: { attachmentPath: string | null; attachmentName: string | null },
): Promise<AttachmentFieldUpdate | { error: string } | undefined> {
  const upload = getCourseAnnouncementAttachmentFile(formData);
  const remove = formData.get("removeAttachment") === "1";

  if (upload) {
    const validation = validateAnnouncementAttachment(upload);
    if (validation.error) return { error: validation.error };
    if (existing?.attachmentPath) {
      await deleteAnnouncementAttachment(existing.attachmentPath);
    }
    return saveAnnouncementAttachment(announcementId, upload);
  }

  if (remove && existing?.attachmentPath) {
    await deleteAnnouncementAttachment(existing.attachmentPath);
    return { attachmentPath: null, attachmentName: null };
  }

  return undefined;
}
