import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/site/Section";
import { formatSiteAnnouncementDate, getSiteAnnouncementById } from "@/lib/site-announcements";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const announcement = await getSiteAnnouncementById(id);
  if (!announcement) return { title: "Announcement not found" };
  return {
    title: announcement.title,
    description: announcement.body.slice(0, 160),
  };
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { id } = await params;
  const announcement = await getSiteAnnouncementById(id);

  if (!announcement) notFound();

  return (
    <Section>
      <Link href="/announcements" className="text-sm font-medium text-gold hover:underline">
        ← All announcements
      </Link>

      <article className="mx-auto mt-6 max-w-3xl">
        {announcement.imagePath && (
          <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-xl border border-border bg-background">
            <Image
              src={announcement.imagePath}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {(announcement.eventDate || announcement.location) && (
          <div className="text-sm font-semibold uppercase tracking-wide text-gold">
            {announcement.eventDate && <p>{announcement.eventDate}</p>}
            {announcement.location && (
              <p className={announcement.eventDate ? "mt-1" : undefined}>{announcement.location}</p>
            )}
          </div>
        )}

        <h1 className="mt-3 font-serif text-2xl font-bold text-foreground sm:text-3xl">
          {announcement.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Posted {formatSiteAnnouncementDate(announcement.createdAt)}
        </p>

        <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-foreground">
          {announcement.body}
        </div>
      </article>
    </Section>
  );
}
