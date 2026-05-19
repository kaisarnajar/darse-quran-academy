import {
  dailyInspirationHomeTitle,
  type DailyInspirationRecord,
} from "@/lib/daily-inspiration";

type HomeDailyInspirationProps = {
  inspiration: DailyInspirationRecord | null;
};

export function HomeDailyInspiration({ inspiration }: HomeDailyInspirationProps) {
  if (!inspiration) return null;

  const title = dailyInspirationHomeTitle(inspiration.kind);

  return (
    <section className="pattern-teal py-14 sm:py-16" aria-labelledby="daily-inspiration-heading">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p
          id="daily-inspiration-heading"
          className="text-xs font-bold uppercase tracking-[0.2em] text-white"
        >
          {title}
        </p>

        <blockquote className="mt-8">
          <p
            className="indo-pak-arabic text-2xl leading-loose text-white sm:text-3xl"
            dir="rtl"
            lang="ar"
          >
            {inspiration.arabicText}
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/95 sm:text-lg">
            {inspiration.englishTranslation}
          </p>
          {inspiration.reference && (
            <footer className="mt-6 text-sm font-medium italic text-primary-light">
              — {inspiration.reference}
            </footer>
          )}
        </blockquote>
      </div>
    </section>
  );
}
