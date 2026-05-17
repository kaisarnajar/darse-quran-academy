import Image from "next/image";
import Link from "next/link";
import { SplitSectionTitle } from "@/components/site/SplitSectionTitle";

export function HomeAbout() {
  return (
    <section className="pattern-teal py-16 text-white sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-2xl lg:order-1">
          <Image
            src="/about-visual.webp"
            alt="Quran and Islamic learning"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="lg:order-2">
          <SplitSectionTitle muted="About" accent="Us" className="!text-white [&_.title-muted]:!text-white [&_.title-accent]:!text-[var(--gold-light)]" />
          <p className="mt-6 text-sm leading-relaxed text-white/90 sm:text-base">
            Darse Quran Academy is dedicated to authentic Islamic education online. We connect
            students worldwide with qualified teachers for Quran recitation, Tajweed, memorization,
            Arabic, and Islamic studies—through structured programs and caring mentorship.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
            Whether you are beginning your journey or advancing your knowledge, our academy offers
            flexible scheduling, free trial lessons, and certificates upon course completion.
          </p>
          <Link
            href="/about"
            className="btn-gold-outline mt-8 inline-flex items-center justify-center border-white px-8 py-3 text-sm text-white hover:bg-white hover:text-teal"
          >
            Read More
          </Link>
        </div>
      </div>
    </section>
  );
}
