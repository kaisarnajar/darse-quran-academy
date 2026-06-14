"use server";

import { redirect } from "next/navigation";
import { requireTeacher } from "@/lib/auth-actions";
import {
  canTeacherManageCourseAnnouncement,
} from "@/lib/announcements";
import {
  getCourseAnnouncementAttachmentFile,
  parseCourseAnnouncementForm,
  revalidateCourseAnnouncementPaths,
  revalidateStudentAnnouncementPaths,
  resolveCourseAnnouncementAttachment,
} from "@/lib/course-announcement-mutations";
import { getTeacherEnrollmentInCourse } from "@/lib/teacher-portal";
import {
  deleteAnnouncementAttachment,
  saveAnnouncementAttachment,
  validateAnnouncementAttachment,
} from "@/lib/announcement-upload";
import { getTeacherCourseForPortal } from "@/lib/teacher-portal";
import {
  notifyEnrolledStudentsOfCourseAnnouncement,
  notifyStudentOfPersonalMessage,
} from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

function announcementFormPath(courseId: string, suffix = "") {
  return `/teacher/courses/${courseId}/announcements${suffix}`;
}

function studentAnnouncementFormPath(courseId: string, enrollmentId: string, suffix = "") {
  return `/teacher/courses/${courseId}/students/${enrollmentId}/announcements${suffix}`;
}

async function requireTeacherCourse(courseId: string) {
  const { teacher } = await requireTeacher();
  const course = await getTeacherCourseForPortal(teacher.id, courseId);
  if (!course) {
    redirect("/teacher");
  }
  return { teacher, course };
}

export async function createCourseAnnouncement(courseId: string, formData: FormData) {
  const { teacher, course } = await requireTeacherCourse(courseId);
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
      enrollmentId: null,
      teacherId: teacher.id,
      authorName: teacher.name,
      postedByAdmin: false,
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

  await notifyEnrolledStudentsOfCourseAnnouncement({
    courseId,
    courseTitle: course.title,
    announcementId: announcement.id,
    title: parsed.data.title,
    body: parsed.data.body,
  });

  revalidateCourseAnnouncementPaths(courseId);
  redirect(`${announcementFormPath(courseId)}?posted=1`);
}

export async function updateCourseAnnouncement(
  courseId: string,
  announcementId: string,
  formData: FormData,
) {
  const { teacher } = await requireTeacherCourse(courseId);
  const parsed = parseCourseAnnouncementForm(formData);

  if (!parsed.success) {
    redirect(
      `${announcementFormPath(courseId, `/${announcementId}/edit`)}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`,
    );
  }

  const existing = await prisma.courseAnnouncement.findFirst({
    where: { id: announcementId, courseId, enrollmentId: null },
  });
  if (!existing) {
    redirect(`${announcementFormPath(courseId)}?error=notfound`);
  }
  if (!canTeacherManageCourseAnnouncement(existing, teacher.id)) {
    redirect(`${announcementFormPath(courseId)}?error=forbidden`);
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

export async function deleteCourseAnnouncement(courseId: string, announcementId: string) {
  const { teacher } = await requireTeacherCourse(courseId);

  const existing = await prisma.courseAnnouncement.findFirst({
    where: { id: announcementId, courseId, enrollmentId: null },
  });
  if (!existing) {
    redirect(`${announcementFormPath(courseId)}?error=notfound`);
  }
  if (!canTeacherManageCourseAnnouncement(existing, teacher.id)) {
    redirect(`${announcementFormPath(courseId)}?error=forbidden`);
  }

  await deleteAnnouncementAttachment(existing.attachmentPath);
  await prisma.courseAnnouncement.delete({ where: { id: announcementId } });

  revalidateCourseAnnouncementPaths(courseId);
  redirect(`${announcementFormPath(courseId)}?deleted=1`);
}

async function requireTeacherEnrollment(courseId: string, enrollmentId: string) {
  const { teacher } = await requireTeacher();
  const data = await getTeacherEnrollmentInCourse(teacher.id, courseId, enrollmentId);
  if (!data) {
    redirect("/teacher");
  }
  return { teacher, ...data };
}

export async function createStudentCourseAnnouncement(
  courseId: string,
  enrollmentId: string,
  formData: FormData,
) {
  const { teacher, course, enrollment } = await requireTeacherEnrollment(courseId, enrollmentId);
  const parsed = parseCourseAnnouncementForm(formData);

  if (!parsed.success) {
    redirect(
      `${studentAnnouncementFormPath(courseId, enrollmentId, "/new")}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`,
    );
  }

  const upload = getCourseAnnouncementAttachmentFile(formData);
  if (upload) {
    const validation = validateAnnouncementAttachment(upload);
    if (validation.error) {
      redirect(
        `${studentAnnouncementFormPath(courseId, enrollmentId, "/new")}?error=${encodeURIComponent(validation.error)}`,
      );
    }
  }

  const announcement = await prisma.courseAnnouncement.create({
    data: {
      courseId,
      enrollmentId,
      teacherId: teacher.id,
      authorName: teacher.name,
      postedByAdmin: false,
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

  await notifyStudentOfPersonalMessage({
    userId: enrollment.userId,
    courseId,
    courseTitle: course.title,
    announcementId: announcement.id,
    title: parsed.data.title,
    body: parsed.data.body,
    teacherName: teacher.name,
  });

  revalidateStudentAnnouncementPaths(courseId, enrollmentId);
  redirect(`${studentAnnouncementFormPath(courseId, enrollmentId)}?posted=1`);
}

export async function updateStudentCourseAnnouncement(
  courseId: string,
  enrollmentId: string,
  announcementId: string,
  formData: FormData,
) {
  const { teacher } = await requireTeacherEnrollment(courseId, enrollmentId);
  const parsed = parseCourseAnnouncementForm(formData);

  if (!parsed.success) {
    redirect(
      `${studentAnnouncementFormPath(courseId, enrollmentId, `/${announcementId}/edit`)}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`,
    );
  }

  const existing = await prisma.courseAnnouncement.findFirst({
    where: { id: announcementId, courseId, enrollmentId },
  });
  if (!existing) {
    redirect(`${studentAnnouncementFormPath(courseId, enrollmentId)}?error=notfound`);
  }
  if (!canTeacherManageCourseAnnouncement(existing, teacher.id)) {
    redirect(`${studentAnnouncementFormPath(courseId, enrollmentId)}?error=forbidden`);
  }

  const attachmentUpdate = await resolveCourseAnnouncementAttachment(formData, announcementId, existing);
  if (attachmentUpdate && "error" in attachmentUpdate) {
    redirect(
      `${studentAnnouncementFormPath(courseId, enrollmentId, `/${announcementId}/edit`)}?error=${encodeURIComponent(attachmentUpdate.error)}`,
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

  revalidateStudentAnnouncementPaths(courseId, enrollmentId);
  redirect(`${studentAnnouncementFormPath(courseId, enrollmentId)}?saved=1`);
}

export async function deleteStudentCourseAnnouncement(
  courseId: string,
  enrollmentId: string,
  announcementId: string,
) {
  const { teacher } = await requireTeacherEnrollment(courseId, enrollmentId);

  const existing = await prisma.courseAnnouncement.findFirst({
    where: { id: announcementId, courseId, enrollmentId },
  });
  if (!existing) {
    redirect(`${studentAnnouncementFormPath(courseId, enrollmentId)}?error=notfound`);
  }
  if (!canTeacherManageCourseAnnouncement(existing, teacher.id)) {
    redirect(`${studentAnnouncementFormPath(courseId, enrollmentId)}?error=forbidden`);
  }

  await deleteAnnouncementAttachment(existing.attachmentPath);
  await prisma.courseAnnouncement.delete({ where: { id: announcementId } });

  revalidateStudentAnnouncementPaths(courseId, enrollmentId);
  redirect(`${studentAnnouncementFormPath(courseId, enrollmentId)}?deleted=1`);
}
