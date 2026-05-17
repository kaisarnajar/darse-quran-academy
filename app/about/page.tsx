import type { Metadata } from "next";
import { Section } from "@/components/site/Section";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Darse Quran Academy's mission, values, and contact information.",
};

const values = [
  {
    title: "Authenticity",
    description:
      "Curricula rooted in classical Islamic scholarship, taught with clarity and care for the sources.",
  },
  {
    title: "Accessibility",
    description: "Quality Islamic education should be available to students worldwide, online.",
  },
  {
    title: "Excellence",
    description: "Structured programs, qualified teachers, and regular assessment for steady progress.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section>
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
            About Darse Quran Academy
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">
            Darse Quran Academy was established to provide structured, authentic Islamic education open to
            Muslims of every background. We offer courses in Quran recitation (Nazira), memorization (Hifz),
            Tajweed, Arabic grammar, Islamic studies, and Seerah—taught by experienced instructors.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Our programs blend time-tested teaching methods with modern online delivery, so students of
            all ages and backgrounds can learn from qualified teachers wherever they live.
          </p>
        </div>
      </Section>

      <Section className="bg-accent-muted/30">
        <h2 className="text-center font-serif text-xl font-bold text-foreground sm:text-2xl">Our Values</h2>
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 md:grid-cols-3 md:gap-8">
          {values.map((value) => (
            <li key={value.title} className="card-elevated p-6 text-center">
              <h3 className="font-serif text-lg font-semibold text-primary">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{value.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="card-elevated mx-auto max-w-xl p-6 text-center sm:p-8">
          <h2 className="font-serif text-lg font-bold text-primary sm:text-xl">Contact Us</h2>
          <ul className="mt-5 space-y-4 text-left text-sm text-muted sm:mt-6 sm:text-base">
            <li className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              <span className="shrink-0 font-medium text-foreground">Email:</span>
              <span className="break-all">info@darsequranacademy.org</span>
            </li>
            <li className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              <span className="shrink-0 font-medium text-foreground">Phone / WhatsApp:</span>
              <span>+91 98765 43210</span>
            </li>
            <li className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              <span className="shrink-0 font-medium text-foreground">Location:</span>
              <span>Online academy — serving students worldwide</span>
            </li>
          </ul>
          <p className="mt-5 text-left text-sm leading-relaxed text-muted sm:mt-6 sm:text-center">
            For course enrollment inquiries, please mention the course name in your message. We aim to
            respond within 2–3 business days.
          </p>
        </div>
      </Section>
    </>
  );
}
