import Link from "next/link";

export function HomeHero() {
  return (
    <section className="bg-gradient-to-br from-stone-900 via-teal-900 to-stone-800 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h1 className="text-3xl font-bold text-gold-light sm:text-4xl">Darse Quran Academy</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
          Learn Quran, Tajweed, and Islamic studies online with qualified teachers—wherever you are.
        </p>
        <Link href="/courses" className="btn-gold-outline mt-6 inline-flex px-6 py-2.5 text-sm">
          View Courses
        </Link>
      </div>
    </section>
  );
}
