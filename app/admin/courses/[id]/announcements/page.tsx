import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteAdminCourseAnnouncement } from "@/app/admin/courses/[id]/announcements/actions";
import { AdminCourseAnnouncementCard } from "@/components/admin/AdminCourseAnnouncementCard";
import { requireAdmin } from "@/lib/auth-actions";
import { getAnnouncementAuthorName, getCourseWideAnnouncementsForCourse } from "@/lib/announcements";
import { getCourseById } from "@/lib/courses";

export default async function AdminCourseAnnouncementsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ posted?: string; saved?: string; deleted?: string; error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const course = await getCourseById(id);

  if (!course) notFound();

  const announcements = await getCourseWideAnnouncementsForCourse(course.id);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Post course-wide updates for enrolled students — schedule changes, academy notices, and more.
        </p>
        <Link
          href={`/admin/courses/${course.id}/announcements/new`}
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
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Announcement updated.</p>
      )}
      {query.deleted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Announcement deleted.</p>
      )}
      {query.error === "notfound" && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          That announcement could not be found.
        </p>
      )}

      {announcements.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
          No announcements for this course yet.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <li key={announcement.id} className="h-full">
              <AdminCourseAnnouncementCard
                courseId={course.id}
                announcementId={announcement.id}
                category={announcement.category}
                title={announcement.title}
                body={announcement.body}
                authorName={getAnnouncementAuthorName(announcement)}
                createdAt={announcement.createdAt}
                updatedAt={announcement.updatedAt}
                attachmentPath={announcement.attachmentPath}
                attachmentName={announcement.attachmentName}
                deleteAction={deleteAdminCourseAnnouncement}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
