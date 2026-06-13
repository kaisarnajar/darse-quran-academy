import Link from "next/link";
import { createSiteAnnouncement } from "@/app/admin/announcements/actions";
import { SiteAnnouncementForm } from "@/components/admin/SiteAnnouncementForm";

export default async function NewSiteAnnouncementPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <Link href="/admin/announcements" className="text-sm text-primary hover:underline">
        ← Back to announcements
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-bold text-primary">New announcement</h1>
      <p className="mt-1 text-sm text-muted">
        Share events such as guest scholars at a masjid. Use &quot;Show on homepage&quot; to feature up
        to four items on the main page; every published item appears on the Announcements page.
      </p>
      <div className="mt-8">
        <SiteAnnouncementForm
          action={createSiteAnnouncement}
          submitLabel="Publish announcement"
          error={error ? decodeURIComponent(error) : undefined}
        />
      </div>
    </div>
  );
}
