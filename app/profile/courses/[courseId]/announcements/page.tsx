import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { requireUser } from "@/lib/auth-actions";
import { getAnnouncementAuthorName, getAnnouncementsForCourse } from "@/lib/announcements";
import { getStudentCourseForAnnouncements } from "@/lib/student-announcements";

export default async function StudentCourseAnnouncementsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await requireUser();
  const data = await getStudentCourseForAnnouncements(session.user.id, courseId);

  if (!data) notFound();

  const { course } = data;
  const announcements = await getAnnouncementsForCourse(courseId);

  return (
    <div>
      <Link href="/profile/courses" className="text-sm font-medium text-primary hover:underline">
        ← My courses
      </Link>
      <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">{course.title}</h2>
      <p className="mt-1 text-sm text-muted">
        Course announcements from your instructor and the academy
      </p>

      {announcements.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
          No announcements from your teacher yet. Check back later.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {announcements.map((announcement) => (
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
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
