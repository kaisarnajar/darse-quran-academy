import type { Metadata } from "next";
import { LibraryCard } from "@/components/LibraryCard";
import { LibraryCategoryFilter } from "@/components/library/LibraryCategoryFilter";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { isLibraryTopic } from "@/lib/library-options";
import { getPublishedLibraryItems } from "@/lib/library";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse Islamic books and study materials in the Darse Quran Academy digital library.",
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category =
    params.category && isLibraryTopic(params.category) ? params.category : undefined;
  const libraryItems = await getPublishedLibraryItems(category);

  return (
    <Section>
      <PageHeader
        title="Digital Library"
        description="A curated collection of Islamic books and resources for students. PDF downloads will be available in a future update."
      />

      <div className="mt-10">
        <LibraryCategoryFilter activeCategory={category} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {libraryItems.length === 0 ? (
          <p className="col-span-full text-center text-muted">
            {category
              ? `No resources in “${category}” yet.`
              : "No library items available yet."}
          </p>
        ) : (
          libraryItems.map((item) => <LibraryCard key={item.id} item={item} />)
        )}
      </div>
    </Section>
  );
}
