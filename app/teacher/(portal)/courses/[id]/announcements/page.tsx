import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { DeleteAnnouncementButton } from "@/components/teacher/DeleteAnnouncementButton";
import { requireTeacher } from "@/lib/auth-actions";
import {
  canTeacherManageCourseAnnouncement,
  getAnnouncementAuthorName,
  getCourseWideAnnouncementsForCourse,
} from "@/lib/announcements";
import { getTeacherCourseForPortal } from "@/lib/teacher-portal";

export default async function TeacherCourseAnnouncementsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ posted?: string; saved?: string; deleted?: string; error?: string; forbidden?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const { teacher } = await requireTeacher();
  const course = await getTeacherCourseForPortal(teacher.id, id);

  if (!course) notFound();

  const announcements = await getCourseWideAnnouncementsForCourse(course.id);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Course-wide updates for all enrolled students. To message one student (e.g. exam marks), use{" "}
          <span className="font-medium text-foreground">Message student</span> on the Students tab.
        </p>
        <Link
          href={`/teacher/courses/${course.id}/announcements/new`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light"
        >
          New announcement
        </Link>
      </div>

      {query.posted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Announcement posted successfully.
        </p>
      )}
      {query.saved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Announcement updated.
        </p>
      )}
      {query.deleted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Announcement deleted.
        </p>
      )}
      {query.error === "notfound" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          That announcement could not be found.
        </p>
      )}
      {query.error === "forbidden" && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Only your own announcements can be edited or deleted. Academy admin posts are managed from the admin portal.
        </p>
      )}

      {announcements.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
          No announcements yet. Create one to notify your students.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {announcements.map((announcement) => {
            const canManage = canTeacherManageCourseAnnouncement(announcement, teacher.id);
            return (
            <li key={announcement.id}>
              <div className="relative">
                <AnnouncementCard
                  category={announcement.category}
                  title={announcement.title}
                  body={announcement.body}
                  authorName={getAnnouncementAuthorName(announcement)}
                  createdAt={announcement.createdAt}
                  updatedAt={announcement.updatedAt}
                  attachmentPath={announcement.attachmentPath}
                  attachmentName={announcement.attachmentName}
                />
                {canManage ? (
                  <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border pt-3">
                    <Link
                      href={`/teacher/courses/${course.id}/announcements/${announcement.id}/edit`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteAnnouncementButton courseId={course.id} announcementId={announcement.id} />
                  </div>
                ) : announcement.postedByAdmin ? (
                  <p className="mt-3 border-t border-border pt-3 text-xs text-muted">
                    Posted by the academy administration
                  </p>
                ) : null}
              </div>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
