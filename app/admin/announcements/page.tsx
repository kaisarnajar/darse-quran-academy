import Link from "next/link";
import { DeleteSiteAnnouncementButton } from "@/components/admin/DeleteSiteAnnouncementButton";
import { getAllSiteAnnouncementsForAdmin } from "@/lib/site-announcements";

function statusBadge(published: boolean, showOnHomepage: boolean) {
  if (!published) return { label: "Draft", className: "bg-stone-200 text-stone-800" };
  if (showOnHomepage) return { label: "Home + Public", className: "bg-violet-100 text-violet-900" };
  return { label: "Published", className: "bg-emerald-100 text-emerald-900" };
}

export default async function AdminAnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ posted?: string; saved?: string; deleted?: string; error?: string }>;
}) {
  const params = await searchParams;
  const announcements = await getAllSiteAnnouncementsForAdmin();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Announcements</h1>
          <p className="mt-1 text-sm text-muted">
            Academy-wide news — events, scholar visits, masjid programs, and more.
          </p>
        </div>
        <Link
          href="/admin/announcements/new"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light"
        >
          New announcement
        </Link>
      </div>

      {params.posted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Announcement created.</p>
      )}
      {params.saved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Announcement updated.</p>
      )}
      {params.deleted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Announcement deleted.</p>
      )}
      {params.error === "notfound" && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">Announcement not found.</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        {announcements.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">No announcements yet.</p>
        ) : (
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">When / Where</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Photo</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {announcements.map((item) => {
                const badge = statusBadge(item.published, item.showOnHomepage);
                return (
                  <tr key={item.id} className="hover:bg-background/30">
                    <td className="px-4 py-3 font-medium text-foreground">{item.title}</td>
                    <td className="px-4 py-3 text-muted">
                      {item.eventDate && <p>{item.eventDate}</p>}
                      {item.location && <p className="text-xs">{item.location}</p>}
                      {!item.eventDate && !item.location && "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{item.imagePath ? "Yes" : "—"}</td>
                    <td className="px-4 py-3 text-muted">
                      {item.createdAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-3">
                        <Link
                          href={`/announcements/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted hover:text-primary"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/announcements/${item.id}/edit`}
                          className="font-medium text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteSiteAnnouncementButton id={item.id} title={item.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
