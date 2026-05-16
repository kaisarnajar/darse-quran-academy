import type { Metadata } from "next";
import { LibraryCard } from "@/components/LibraryCard";
import { Section } from "@/components/site/Section";
import { libraryItems } from "@/content/library";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse Islamic books and study materials in the Darse Quran Academy digital library.",
};

export default function LibraryPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl">Digital Library</h1>
        <p className="mt-4 text-muted">
          A curated collection of Islamic books and resources for students. PDF downloads will be
          available in a future update.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {libraryItems.map((item) => (
          <LibraryCard key={item.id} item={item} />
        ))}
      </div>
    </Section>
  );
}
