import { Section } from "@/components/site/Section";
import { HadithTypewriter } from "@/components/site/HadithTypewriter";

export function HadithBanner() {
  return (
    <section
      className="border-y border-primary/15 bg-gradient-to-b from-accent-muted/60 via-surface to-accent-muted/40"
      aria-label="Hadith about learning and teaching the Quran"
    >
      <Section className="py-10 sm:py-14">
        <HadithTypewriter />
      </Section>
    </section>
  );
}
