import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { ACADEMY_LOCATION, getAcademyLocationEmbedUrl } from "@/lib/academy-location";
import { formatWhatsAppForDisplay, getSocialLinksSettings } from "@/lib/social-links";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Darse-Quran is a non-profit Sunni Islamic media group in South Asia. Learn about our mission, online academy, and contact information.",
};

const values = [
  {
    title: "Authenticity",
    description:
      "Teaching rooted in classical Sunni scholarship, with clarity and care for the sources of Islam.",
  },
  {
    title: "Accessibility",
    description:
      "Online classes and resources so students worldwide can learn, with a schedule that respects daily life and prayer.",
  },
  {
    title: "Excellence",
    description: "Structured programs, qualified teachers, and regular assessment for steady progress.",
  },
];

export default async function AboutPage() {
  const social = await getSocialLinksSettings();
  const whatsappDisplay = formatWhatsAppForDisplay(social.whatsappNumber);

  return (
    <>
      <Section>
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
            About Us
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">
            Darse-Quran is a non-profit Sunni Islamic Media Group based in South Asia, mainly functioning
            in Jammu and Kashmir aiming to spread the teaching of Islam to people all over the globe. It is
            engaged in propagating the religion of Islam, elucidating its principles and tenets, refuting
            suspicious and false allegations made against the religion. The group uses various print and
            electronic means to spread the message of Islam and peace.
          </p>
        </div>
      </Section>

      <Section className="bg-accent-muted/20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-xl font-bold text-primary sm:text-2xl">Darse Quran Academy</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Darse Quran Academy is the online teaching platform of Darse-Quran. It offers structured,
            authentic Islamic education to Muslims everywhere—through live classes, course enrollment, and
            learning materials—while staying aligned with the group&apos;s mission of clear, sound da&apos;wah.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Our instructors guide students in Quran recitation (Nazira), memorization (Hifz), Tajweed,
            Arabic grammar, Islamic studies, and Seerah. Classes are generally after Isha salah, so
            learners can work or study during the day and give prayer its proper place in their routine.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Beyond courses, the academy provides a public Fatwa Q&amp;A section where questions can be
            submitted and answered according to Sunni scholarship, and a digital library of Islamic books
            and resources for ongoing study.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Students who complete structured programs with the required progress may earn completion
            certificates. Whether you are beginning your journey with the Quran or building on prior
            knowledge, we aim to support you with qualified teachers and a caring, disciplined learning
            environment.
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

      <Section id="contact">
        <div className="card-elevated mx-auto max-w-3xl p-6 text-center sm:p-8">
          <h2 className="text-lg font-bold uppercase tracking-wide text-gold sm:text-xl">Contact Us</h2>
          <ul className="mt-5 space-y-4 text-left text-sm text-muted sm:mt-6 sm:text-base">
            <li className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              <span className="shrink-0 font-medium text-foreground">Email:</span>
              {social.contactEmail ? (
                <a href={`mailto:${social.contactEmail}`} className="break-all hover:text-gold">
                  {social.contactEmail}
                </a>
              ) : (
                <span className="break-all">—</span>
              )}
            </li>
            <li className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              <span className="shrink-0 font-medium text-foreground">Phone / WhatsApp:</span>
              <span>{whatsappDisplay || "—"}</span>
            </li>
            <li className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              <span className="shrink-0 font-medium text-foreground">Location:</span>
              <a
                href={ACADEMY_LOCATION.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1.5 font-medium text-[#1a73e8] underline decoration-[#1a73e8]/50 underline-offset-2 transition-colors hover:text-[#1557b0] hover:decoration-[#1557b0] sm:items-center"
              >
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#ea4335] sm:mt-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                </svg>
                <span>{ACADEMY_LOCATION.label}</span>
              </a>
            </li>
          </ul>

          <div className="mt-6 overflow-hidden rounded-lg border border-border">
            <iframe
              title={`${ACADEMY_LOCATION.name} on Google Maps`}
              src={getAcademyLocationEmbedUrl()}
              className="h-64 w-full border-0 sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <p className="mt-5 text-left text-sm leading-relaxed text-muted sm:mt-6 sm:text-center">
            For course enrollment inquiries, please mention the course name in your message. We aim to
            respond within 2–3 business days.
          </p>
        </div>
      </Section>
    </>
  );
}
