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
          <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl">About Darse Quran Academy</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Darse Quran Academy was established to provide structured, authentic Islamic education to
            Muslims around the world. We offer courses in Quran recitation (Nazira), memorization (Hifz),
            Tajweed, Arabic grammar, Fiqh, and Seerah—taught by graduates of renowned seminaries.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Our approach combines traditional Deobandi scholarship with modern online delivery, making
            it possible for students of all ages and backgrounds to learn from qualified teachers without
            leaving home.
          </p>
        </div>
      </Section>

      <Section className="bg-surface/50">
        <h2 className="text-center font-serif text-2xl font-bold text-foreground">Our Values</h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {values.map((value) => (
            <li key={value.title} className="rounded-lg border border-border bg-surface p-6 text-center">
              <h3 className="font-serif text-lg font-semibold text-primary">{value.title}</h3>
              <p className="mt-3 text-sm text-muted">{value.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="mx-auto max-w-xl rounded-lg border border-border bg-surface p-8 text-center shadow-sm">
          <h2 className="font-serif text-xl font-bold text-primary">Contact Us</h2>
          <ul className="mt-6 space-y-3 text-muted">
            <li>
              <span className="font-medium text-foreground">Email: </span>
              info@darsequranacademy.org
            </li>
            <li>
              <span className="font-medium text-foreground">Phone / WhatsApp: </span>
              +91 98765 43210
            </li>
            <li>
              <span className="font-medium text-foreground">Location: </span>
              Deoband, Uttar Pradesh, India
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted">
            For course enrollment inquiries, please mention the course name in your message. We aim to
            respond within 2–3 business days.
          </p>
        </div>
      </Section>
    </>
  );
}
