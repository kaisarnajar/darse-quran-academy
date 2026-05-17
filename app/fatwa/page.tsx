import type { Metadata } from "next";
import Link from "next/link";
import { FatwaCard } from "@/components/fatwa/FatwaCard";
import { FatwaCategoryFilter } from "@/components/fatwa/FatwaCategoryFilter";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { getAnsweredFatwas, isFatwaCategory } from "@/lib/fatwa";

export const metadata: Metadata = {
  title: "Fatwa Section",
  description:
    "Browse answered questions on Islam, Atheism, and related topics. Submit your own question to Darse Quran Academy.",
};

export default async function FatwaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category =
    params.category && isFatwaCategory(params.category) ? params.category : undefined;
  const fatwas = await getAnsweredFatwas(category);

  return (
    <Section>
      <PageHeader
        title="Fatwa Section"
        description="Questions answered by our scholars on Islam, Atheism, fatwa, and related topics."
      />

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/fatwa/ask"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
        >
          Ask a question
        </Link>
      </div>

      <div className="mt-10">
        <FatwaCategoryFilter activeCategory={category} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {fatwas.length === 0 ? (
          <p className="col-span-full text-center text-muted">
            {category
              ? `No answered questions in “${category}” yet.`
              : "No answered questions yet. Be the first to ask!"}
          </p>
        ) : (
          fatwas.map((fatwa) => <FatwaCard key={fatwa.id} fatwa={fatwa} />)
        )}
      </div>
    </Section>
  );
}
