import type { Metadata } from "next";
import { SiteAnnouncementCard } from "@/components/announcements/SiteAnnouncementCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { getPublishedSiteAnnouncements } from "@/lib/site-announcements";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "Events, scholar visits, and academy updates from Darse Quran Academy — masjid programs, special sessions, and more.",
};

export default async function AnnouncementsPage() {
  const announcements = await getPublishedSiteAnnouncements();

  return (
    <Section>
      <PageHeader
        title="Announcements"
        description="Events, visits, and important news from the academy. Check back for programs at local masajid and special sessions."
      />

      {announcements.length === 0 ? (
        <p className="mt-12 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center text-muted">
          No announcements at the moment. Please check again soon.
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <li key={announcement.id}>
              <SiteAnnouncementCard announcement={announcement} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
