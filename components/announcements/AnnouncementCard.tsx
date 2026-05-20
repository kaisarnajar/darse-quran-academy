import type { AnnouncementCategory } from "@prisma/client";
import { AnnouncementAttachment } from "@/components/announcements/AnnouncementAttachment";
import { AnnouncementCategoryBadge } from "@/components/announcements/AnnouncementCategoryBadge";
import { formatAnnouncementDate } from "@/lib/announcements";

type AnnouncementCardProps = {
  category: AnnouncementCategory;
  title: string;
  body: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  attachmentPath?: string | null;
  attachmentName?: string | null;
};

export function AnnouncementCard({
  category,
  title,
  body,
  authorName,
  createdAt,
  updatedAt,
  attachmentPath,
  attachmentName,
}: AnnouncementCardProps) {
  const edited = updatedAt.getTime() - createdAt.getTime() > 1000;

  return (
    <article className="rounded-lg border border-border bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <AnnouncementCategoryBadge category={category} />
        {edited && <span className="text-xs text-muted">Edited</span>}
      </div>
      <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{body}</p>
      {attachmentPath && attachmentName && (
        <AnnouncementAttachment attachmentPath={attachmentPath} attachmentName={attachmentName} />
      )}
      <p className="mt-4 text-xs text-muted">
        Posted by {authorName} · {formatAnnouncementDate(createdAt)}
      </p>
    </article>
  );
}
