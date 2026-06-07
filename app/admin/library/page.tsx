import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getAllLibraryItems } from "@/lib/library";

export default async function AdminLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
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

      {params.deleted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Item deleted.</p>
      )}

      <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-sm text-muted">
                {item.author} · {item.topic}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {item.featuredOnHomepage && item.published ? (
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-900">
                  Homepage
                </span>
              ) : null}
              <StatusBadge published={item.published} />
              <Link href={`/admin/library/${item.id}/edit`} className="text-sm text-primary hover:underline">
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
