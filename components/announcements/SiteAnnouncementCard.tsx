import Image from "next/image";
import Link from "next/link";
import type { SiteAnnouncementPublic } from "@/lib/site-announcements";
import { formatSiteAnnouncementDate } from "@/lib/site-announcements";

type SiteAnnouncementCardProps = {
  announcement: SiteAnnouncementPublic;
  compact?: boolean;
};

export function SiteAnnouncementCard({ announcement, compact = false }: SiteAnnouncementCardProps) {
  return (
    <article className="card-elevated flex h-full flex-col overflow-hidden">
      {announcement.imagePath && (
        <div className={`relative w-full ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
          <Image
            src={announcement.imagePath}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {(announcement.eventDate || announcement.location) && (
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">
            {[announcement.eventDate, announcement.location].filter(Boolean).join(" · ")}
          </p>
        )}
        <h3 className={`font-serif font-semibold text-foreground ${compact ? "mt-2 text-lg" : "mt-2 text-xl"}`}>
          {announcement.title}
        </h3>
        <p className={`mt-3 flex-1 text-muted ${compact ? "line-clamp-3 text-sm" : "line-clamp-4 text-sm leading-relaxed"}`}>
          {announcement.body}
        </p>
        <p className="mt-4 text-xs text-muted">
          Posted {formatSiteAnnouncementDate(announcement.createdAt)}
        </p>
        <Link
          href={`/announcements/${announcement.id}`}
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          Read more
        </Link>
      </div>
    </article>
  );
}
