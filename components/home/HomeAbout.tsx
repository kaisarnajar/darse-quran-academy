import Link from "next/link";
import { SplitSectionTitle } from "@/components/site/SplitSectionTitle";

export function HomeAbout() {
  return (
    <section className="pattern-teal py-16 text-white sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <SplitSectionTitle
          muted="About"
          accent="Us"
          className="[&_.title-muted]:!text-white [&_.title-accent]:!text-gold-light"
        />
        <p className="mt-6 text-sm leading-relaxed text-white/90 sm:text-base">
          Darse Quran Academy is dedicated to authentic Islamic education online. We connect students
          worldwide with qualified teachers for Quran recitation, Tajweed, memorization, Arabic, and
          Islamic studies—through structured programs and caring mentorship.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
          Whether you are beginning your journey or advancing your knowledge, our academy offers
          flexible scheduling and certificates upon course completion.
        </p>
        <Link
          href="/about"
          className="btn-gold-outline mt-8 inline-flex border-white px-8 py-3 text-sm text-white hover:bg-white hover:text-teal"
        >
          Read More
        </Link>
      </div>
    </section>
  );
}
