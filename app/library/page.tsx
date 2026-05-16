import type { Metadata } from "next";
import { LibraryCard } from "@/components/LibraryCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { libraryItems } from "@/content/library";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse Islamic books and study materials in the Darse Quran Academy digital library.",
};

export default function LibraryPage() {
  return (
    <Section>
      <PageHeader
        title="Digital Library"
        description="A curated collection of Islamic books and resources for students. PDF downloads will be available in a future update."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {libraryItems.map((item) => (
          <LibraryCard key={item.id} item={item} />
        ))}
      </div>
    </Section>
  );
}
