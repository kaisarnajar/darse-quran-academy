import Link from "next/link";
import { DeleteLibraryButton } from "@/components/admin/DeleteLibraryButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getAllLibraryItems } from "@/lib/library";

export default async function AdminLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; created?: string }>;
}) {
  const params = await searchParams;
  const items = await getAllLibraryItems();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Library</h1>
          <p className="mt-1 text-sm text-muted">{items.length} total</p>
        </div>
        <Link
          href="/admin/library/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          Add item
        </Link>
      </div>

      {params.created === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Item created.</p>
      )}

      {params.deleted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Item deleted.</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No library items yet.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Author · Topic</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Homepage</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-foreground">{item.title}</td>
                  <td className="px-4 py-3 text-muted">
                    {item.author} · {item.topic}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge published={item.published} />
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {item.featuredOnHomepage && item.published ? "Featured" : "Not featured"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        href={`/admin/library/${item.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/library/${item.id}/edit`}
                        className="font-medium text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteLibraryButton id={item.id} label={item.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
