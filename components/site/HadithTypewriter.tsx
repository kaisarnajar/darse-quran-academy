import { Amiri } from "next/font/google";
import { hadithArabic, hadithAttribution, hadithEnglish } from "@/content/hadith-quote";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["700"],
});

export function HadithTypewriter() {
  return (
    <blockquote className="hadith-typewriter mx-auto max-w-3xl">
      <p className="hadith-static hidden text-center">
        <span lang="ar" dir="rtl" className={`${amiri.className} block text-2xl font-bold text-primary sm:text-3xl`}>
          {hadithArabic}
        </span>
        <span className="mt-6 block text-sm font-semibold text-accent">{hadithAttribution},</span>
        <span className="mt-2 block font-serif text-lg text-foreground sm:text-xl">
          &ldquo;{hadithEnglish}&rdquo;
        </span>
      </p>

      <div className="hadith-animated flex min-h-[7rem] flex-col items-center justify-center sm:min-h-[8.5rem]">
        <p
          lang="ar"
          dir="rtl"
          className={`hadith-reveal-ar ${amiri.className} text-2xl font-bold leading-relaxed text-primary sm:text-3xl md:text-4xl`}
        >
          {hadithArabic}
        </p>

        <div className="hadith-reveal-en text-center">
          <p className="text-sm font-semibold tracking-wide text-accent sm:text-base">{hadithAttribution},</p>
          <p className="mt-3 font-serif text-lg leading-relaxed text-foreground sm:text-xl">
            <span className="hadith-reveal-en-quote inline-block">&ldquo;{hadithEnglish}&rdquo;</span>
          </p>
        </div>
      </div>
    </blockquote>
  );
}
