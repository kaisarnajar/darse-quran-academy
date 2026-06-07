import Link from "next/link";
import { LibraryCard } from "@/components/LibraryCard";
import { SplitSectionTitle } from "@/components/site/SplitSectionTitle";
import { getFeaturedHomepageLibraryItems } from "@/lib/library";

export async function FeaturedResources() {
  const items = await getFeaturedHomepageLibraryItems();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="bg-accent-muted/50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <div className="text-center sm:text-left">
            <SplitSectionTitle muted="Featured" accent="Resources" />
            <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
              Books and study materials from the academy digital library.
            </p>
          </div>
          <Link href="/library" className="btn-gold-outline inline-flex shrink-0 px-6 py-2.5 text-sm">
            View all
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <LibraryCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
