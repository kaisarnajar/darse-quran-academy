import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { DeleteAnnouncementButton } from "@/components/teacher/DeleteAnnouncementButton";
import { requireTeacher } from "@/lib/auth-actions";
import {
  canTeacherManageCourseAnnouncement,
  getAnnouncementAuthorName,
  getStudentAnnouncementsForEnrollment,
} from "@/lib/announcements";
import { getTeacherEnrollmentInCourse } from "@/lib/teacher-portal";

export default async function TeacherStudentAnnouncementsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; enrollmentId: string }>;
  searchParams: Promise<{ posted?: string; saved?: string; deleted?: string; error?: string }>;
}) {
  const { id, enrollmentId } = await params;
  const query = await searchParams;
  const { teacher } = await requireTeacher();
  const data = await getTeacherEnrollmentInCourse(teacher.id, id, enrollmentId);

  if (!data) notFound();

  const { course, enrollment } = data;
  const studentName = enrollment.user.name?.trim() || enrollment.user.email;
  const announcements = await getStudentAnnouncementsForEnrollment(enrollment.id);

  return (
    <div>
      <Link href={`/teacher/courses/${course.id}`} className="text-sm font-medium text-teal hover:underline">
        ← Back to students
      </Link>
      <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">{studentName}</h2>
      <p className="mt-1 text-sm text-muted">
        Private announcements for this student only — exam marks, feedback, and personal updates.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Only {studentName} will see messages posted here.</p>
        <Link
          href={`/teacher/courses/${course.id}/students/${enrollment.id}/announcements/new`}
          className="btn-gold-solid inline-flex shrink-0 items-center justify-center px-5 py-2.5 text-xs"
        >
          New message
        </Link>
      </div>

      {query.posted === "1" && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Message sent to {studentName}.
        </p>
      )}
      {query.saved === "1" && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">Message updated.</p>
      )}
      {query.deleted === "1" && (
        <p className="mt-4 rounded-lg bg-stone-100 px-4 py-3 text-sm text-stone-800">Message deleted.</p>
      )}
      {query.error === "notfound" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">That message could not be found.</p>
      )}

      {announcements.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
          No private messages for {studentName} yet.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {announcements.map((announcement) => {
            const canManage = canTeacherManageCourseAnnouncement(announcement, teacher.id);
            return (
              <li key={announcement.id}>
                <AnnouncementCard
                  category={announcement.category}
                  title={announcement.title}
                  body={announcement.body}
                  authorName={getAnnouncementAuthorName(announcement)}
                  createdAt={announcement.createdAt}
                  updatedAt={announcement.updatedAt}
                  attachmentPath={announcement.attachmentPath}
                  attachmentName={announcement.attachmentName}
                  audienceLabel={`For ${studentName}`}
                />
                {canManage && (
                  <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border pt-3">
                    <Link
                      href={`/teacher/courses/${course.id}/students/${enrollment.id}/announcements/${announcement.id}/edit`}
                      className="text-sm font-medium text-teal hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteAnnouncementButton
                      courseId={course.id}
                      announcementId={announcement.id}
                      enrollmentId={enrollment.id}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
