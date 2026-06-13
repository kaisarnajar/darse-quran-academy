import type { AnnouncementCategory } from "@prisma/client";
import Link from "next/link";
import { AnnouncementCategoryBadge } from "@/components/announcements/AnnouncementCategoryBadge";
import { DeleteAnnouncementButton } from "@/components/teacher/DeleteAnnouncementButton";
import { formatAnnouncementDate } from "@/lib/announcements";

type AdminCourseAnnouncementCardProps = {
  courseId: string;
  announcementId: string;
  category: AnnouncementCategory;
  title: string;
  body: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  attachmentPath?: string | null;
  attachmentName?: string | null;
  deleteAction: (courseId: string, announcementId: string) => Promise<void>;
};

export function AdminCourseAnnouncementCard({
  courseId,
  announcementId,
  category,
  title,
  body,
  authorName,
  createdAt,
  updatedAt,
  attachmentPath,
  attachmentName,
  deleteAction,
}: AdminCourseAnnouncementCardProps) {
  const edited = updatedAt.getTime() - createdAt.getTime() > 1000;
  const preview = body.length > 220 ? `${body.slice(0, 220).trimEnd()}…` : body;

  return (
    <article className="card-elevated flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <AnnouncementCategoryBadge category={category} />
          {edited && <span className="text-xs text-muted">Edited</span>}
        </div>
        <h3 className="mt-3 line-clamp-2 font-serif text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-3 line-clamp-4 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-muted">
          {preview}
        </p>
        {attachmentPath && attachmentName && (
          <Link
            href={attachmentPath}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
          >
            {attachmentName}
          </Link>
        )}
        <p className="mt-4 text-xs text-muted">
          Posted by {authorName} · {formatAnnouncementDate(createdAt)}
        </p>
      </div>
      <div className="flex items-center justify-end gap-4 border-t border-border bg-background/40 px-5 py-3 sm:px-6">
        <Link
          href={`/admin/courses/${courseId}/announcements/${announcementId}/edit`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Edit
        </Link>
        <DeleteAnnouncementButton
          courseId={courseId}
          announcementId={announcementId}
          deleteAction={deleteAction}
        />
      </div>
    </article>
  );
}
