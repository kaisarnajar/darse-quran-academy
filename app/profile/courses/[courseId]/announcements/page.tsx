import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { requireUser } from "@/lib/auth-actions";
import {
  getAnnouncementAuthorName,
  getAnnouncementsVisibleToStudent,
} from "@/lib/announcements";
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
  const { courseWide, personal } = await getAnnouncementsVisibleToStudent(session.user.id, courseId);
  const hasAny = courseWide.length > 0 || personal.length > 0;

  return (
    <div>
      <Link href="/profile/courses" className="text-sm font-medium text-primary hover:underline">
        ← My courses
      </Link>
      <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">{course.title}</h2>
      <p className="mt-1 text-sm text-muted">
        Course announcements from your instructor and the academy
      </p>

      {!hasAny ? (
        <p className="mt-8 rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
          No announcements yet. Check back later.
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {personal.length > 0 && (
            <section>
              <h3 className="font-serif text-lg font-semibold text-foreground">For you</h3>
              <p className="mt-1 text-sm text-muted">Private messages from your instructor</p>
              <ul className="mt-4 space-y-4">
                {personal.map((announcement) => (
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
                      audienceLabel="For you only"
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {courseWide.length > 0 && (
            <section>
              <h3 className="font-serif text-lg font-semibold text-foreground">Course-wide</h3>
              <p className="mt-1 text-sm text-muted">Visible to everyone in this course</p>
              <ul className="mt-4 space-y-4">
                {courseWide.map((announcement) => (
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
            </section>
          )}
        </div>
      )}
    </div>
  );
}
