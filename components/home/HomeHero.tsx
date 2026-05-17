import Image from "next/image";
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="relative min-h-[420px] overflow-hidden sm:min-h-[480px] lg:min-h-[540px]">
      <Image
        src="/hero-bg.webp"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="hero-gradient absolute inset-0" aria-hidden />
      <div className="relative mx-auto flex max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
        <h1 className="max-w-2xl text-3xl font-bold leading-tight text-[var(--gold-light)] sm:text-4xl lg:text-5xl">
          Islamic Education Online Academy
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
          Learn Quran, Tajweed, Arabic, and Islamic studies online with qualified teachers—wherever
          you are in the world.
        </p>
        <Link
          href="/about"
          className="btn-gold-outline mt-8 inline-flex w-fit items-center justify-center px-8 py-3 text-sm"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}
