import Link from "next/link";
import { SplitSectionTitle } from "@/components/site/SplitSectionTitle";

export function HomeFatwa() {
  return (
    <section className="bg-accent-muted/50 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <SplitSectionTitle muted="Fatwa" accent="Section" />
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          Browse answered questions on Islam, Quran, Hadith, Fiqh, and more—or submit your own question
          and receive an email when our scholars publish a reply.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/fatwa" className="btn-gold-solid inline-flex px-8 py-3 text-sm">
            Browse Answers
          </Link>
          <Link href="/fatwa/ask" className="btn-gold-outline inline-flex px-8 py-3 text-sm">
            Ask a Question
          </Link>
        </div>
      </div>
    </section>
  );
}
