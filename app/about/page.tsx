import type { Metadata } from "next";
import { Section } from "@/components/site/Section";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Darse Quran Academy's mission, values, and contact information.",
};

const values = [
  {
    title: "Authenticity",
    description: "We follow the Hanafi school and the scholarly tradition of Darul Uloom Deoband.",
  },
  {
    title: "Accessibility",
    description: "Quality Islamic education should be available to students worldwide, online.",
  },
  {
    title: "Excellence",
    description: "Structured curricula, qualified teachers, and regular assessment for steady progress.",
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
            Darse Quran Academy was established to provide structured, authentic Islamic education to
            Muslims around the world. We offer courses in Quran recitation (Nazira), memorization (Hifz),
            Tajweed, Arabic grammar, Fiqh, and Seerah—taught by graduates of renowned seminaries.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Our approach combines traditional Deobandi scholarship with modern online delivery, making
            it possible for students of all ages and backgrounds to learn from qualified teachers without
            leaving home.
          </p>
        </div>
      </Section>

      <Section className="bg-surface/50">
        <h2 className="text-center font-serif text-xl font-bold text-foreground sm:text-2xl">Our Values</h2>
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 md:grid-cols-3 md:gap-8">
          {values.map((value) => (
            <li key={value.title} className="rounded-lg border border-border bg-surface p-5 text-center sm:p-6">
              <h3 className="font-serif text-lg font-semibold text-primary">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{value.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="mx-auto max-w-xl rounded-lg border border-border bg-surface p-5 text-center shadow-sm sm:p-8">
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
              <span>Deoband, Uttar Pradesh, India</span>
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
