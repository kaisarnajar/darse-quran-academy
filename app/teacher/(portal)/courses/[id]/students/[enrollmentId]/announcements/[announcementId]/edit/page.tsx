import Link from "next/link";
import { notFound } from "next/navigation";
import { updateStudentCourseAnnouncement } from "@/app/teacher/courses/actions";
import { AnnouncementForm } from "@/components/teacher/AnnouncementForm";
import { requireTeacher } from "@/lib/auth-actions";
import { canTeacherManageCourseAnnouncement, getAnnouncementForCourse } from "@/lib/announcements";
import { getTeacherEnrollmentInCourse } from "@/lib/teacher-portal";

export default async function EditStudentCourseAnnouncementPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; enrollmentId: string; announcementId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id, enrollmentId, announcementId } = await params;
  const { error } = await searchParams;
  const { teacher } = await requireTeacher();
  const data = await getTeacherEnrollmentInCourse(teacher.id, id, enrollmentId);

  if (!data) notFound();

  const { course, enrollment } = data;
  const announcement = await getAnnouncementForCourse(course.id, announcementId, {
    enrollmentId: enrollment.id,
  });
  if (!announcement || !canTeacherManageCourseAnnouncement(announcement, teacher.id)) notFound();

  const action = updateStudentCourseAnnouncement.bind(null, course.id, enrollment.id, announcement.id);

  return (
    <div>
      <Link
        href={`/teacher/courses/${course.id}/students/${enrollment.id}/announcements`}
        className="text-sm font-medium text-teal hover:underline"
      >
        ← Back to messages
      </Link>
      <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">Edit message</h2>
      <div className="mt-6">
        <AnnouncementForm
          action={action}
          submitLabel="Save changes"
          announcement={announcement}
          error={error ? decodeURIComponent(error) : undefined}
        />
      </div>
    </div>
  );
}
