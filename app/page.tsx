import Link from "next/link";
import { HadithBanner } from "@/components/site/HadithBanner";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getPublishedCourses } from "@/lib/courses";
import { getPublishedTeachers } from "@/lib/teachers";

const features = [
  {
    title: "Online Classes",
    description: "Live and recorded sessions accessible from anywhere in the world.",
    icon: "📖",
  },
  {
    title: "Qualified Teachers",
    description: "Learn from experienced instructors with strong backgrounds in Islamic scholarship.",
    icon: "🎓",
  },
  {
    title: "Structured Curriculum",
    description: "Step-by-step programs from beginner Nazira to advanced Tajweed and Fiqh.",
    icon: "📚",
  },
];

export default async function HomePage() {
  const [courses, teachers] = await Promise.all([getPublishedCourses(), getPublishedTeachers()]);
  const featuredCourses = courses.slice(0, 3);
  const featuredTeachers = teachers.slice(0, 3);

  return (
    <>
      <section className="hero-gradient text-white">
        <Section className="py-12 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 sm:text-sm">
              Bismillah ir-Rahman ir-Rahim
            </p>
            <h1 className="mt-4 font-serif text-2xl font-bold leading-snug sm:text-4xl sm:leading-tight lg:text-5xl">
              Authentic Islamic Education for Every Seeker
            </h1>
            <p className="mt-5 text-base leading-relaxed text-violet-100 sm:text-lg">
              Darse Quran Academy offers Quran recitation, memorization, Tajweed, Arabic, and Islamic
              studies—guided by qualified scholars, wherever you are.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
              <Link
                href="/courses"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-transform hover:scale-[1.02] sm:w-auto"
              >
                View Course Announcements
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-white/80 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                About Us
              </Link>
            </div>
          </div>
        </Section>
      </section>

      <HadithBanner />

      <Section>
        <h2 className="text-center font-serif text-xl font-bold text-foreground sm:text-2xl">Why Choose Us</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 md:grid-cols-3 md:gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="card-elevated p-6 text-center transition-transform hover:-translate-y-0.5">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted text-2xl" aria-hidden>
                {feature.icon}
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-primary">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-accent-muted/40">
        <SectionHeader
          title="Latest Course Announcements"
          description="Enroll in our upcoming programs"
          linkHref="/courses"
          linkLabel="View all →"
        />
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <li key={course.id} className="card-elevated p-5">
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                {course.category}
              </span>
              <h3 className="mt-2 font-serif text-base font-semibold text-foreground sm:text-lg">{course.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted sm:line-clamp-2">{course.description}</p>
              <p className="mt-3 text-xs font-semibold text-primary-light">Starts {course.startDate}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeader
          title="Our Teachers"
          description="Dedicated scholars guiding your learning journey"
          linkHref="/teachers"
          linkLabel="Meet all teachers →"
        />
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {featuredTeachers.map((teacher) => (
            <li key={teacher.id} className="card-elevated flex items-start gap-4 p-5 sm:items-center">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white sm:h-14 sm:w-14"
                aria-hidden
              >
                {teacher.initials}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-base font-semibold text-foreground sm:text-lg">{teacher.name}</h3>
                <p className="mt-0.5 text-sm font-medium text-accent">{teacher.specialization}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <section className="cta-gradient text-white">
        <Section className="py-12 sm:py-16">
          <div className="px-2 text-center sm:px-0">
            <h2 className="font-serif text-xl font-bold sm:text-2xl">Explore Our Digital Library</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-violet-100 sm:text-base">
              Access curated Islamic books and study materials—Quran, Hadith, Fiqh, and more.
            </p>
            <Link
              href="/library"
              className="mt-6 inline-flex min-h-11 w-full max-w-xs items-center justify-center rounded-full bg-accent-warm px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Browse Library
            </Link>
          </div>
        </Section>
      </section>
    </>
  );
}
