import Link from "next/link";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { courses } from "@/content/courses";
import { teachers } from "@/content/teachers";

const features = [
  {
    title: "Online Classes",
    description: "Live and recorded sessions accessible from anywhere in the world.",
    icon: "📖",
  },
  {
    title: "Qualified Teachers",
    description: "Learn from graduates of renowned Islamic seminaries and experienced instructors.",
    icon: "🎓",
  },
  {
    title: "Structured Curriculum",
    description: "Step-by-step programs from beginner Nazira to advanced Tajweed and Fiqh.",
    icon: "📚",
  },
];

export default function HomePage() {
  const featuredCourses = courses.slice(0, 3);
  const featuredTeachers = teachers.slice(0, 3);

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-accent-muted/30 to-background">
        <Section className="py-10 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent sm:text-sm">
              Bismillah ir-Rahman ir-Rahim
            </p>
            <h1 className="mt-3 font-serif text-2xl font-bold leading-snug text-primary sm:mt-4 sm:text-4xl sm:leading-tight lg:text-5xl">
              Authentic Islamic Education for Every Seeker
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">
              Darse Quran Academy offers Quran recitation, memorization, Tajweed, Arabic, and Islamic
              studies—guided by experienced scholars, in the tradition of Deoband.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
              <Link
                href="/courses"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light sm:w-auto"
              >
                View Course Announcements
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:w-auto"
              >
                About Us
              </Link>
            </div>
          </div>
        </Section>
      </section>

      <Section>
        <h2 className="text-center font-serif text-xl font-bold text-foreground sm:text-2xl">Why Choose Us</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 md:grid-cols-3 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-surface p-5 text-center shadow-sm sm:p-6"
            >
              <span className="text-3xl" aria-hidden>
                {feature.icon}
              </span>
              <h3 className="mt-3 font-serif text-lg font-semibold text-primary sm:mt-4">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-surface/50">
        <SectionHeader
          title="Latest Course Announcements"
          description="Enroll in our upcoming programs"
          linkHref="/courses"
          linkLabel="View all →"
        />
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <li key={course.id} className="rounded-lg border border-border bg-surface p-4 sm:p-5">
              <span className="text-xs font-medium text-accent">{course.category}</span>
              <h3 className="mt-1 font-serif text-base font-semibold text-foreground sm:text-lg">{course.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted sm:line-clamp-2">{course.description}</p>
              <p className="mt-3 text-xs font-medium text-primary">Starts {course.startDate}</p>
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
            <li
              key={teacher.id}
              className="flex items-start gap-4 rounded-lg border border-border bg-surface p-4 sm:items-center sm:p-5"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white sm:h-14 sm:w-14"
                aria-hidden
              >
                {teacher.initials}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-base font-semibold text-foreground sm:text-lg">{teacher.name}</h3>
                <p className="mt-0.5 text-sm text-accent">{teacher.specialization}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-border bg-primary text-white">
        <div className="px-2 text-center sm:px-0">
          <h2 className="font-serif text-xl font-bold sm:text-2xl">Explore Our Digital Library</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            Access curated Islamic books and study materials—Quran, Hadith, Fiqh, and more.
          </p>
          <Link
            href="/library"
            className="mt-5 inline-flex min-h-11 w-full max-w-xs items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-primary transition-opacity hover:opacity-90 sm:mt-6 sm:w-auto"
          >
            Browse Library
          </Link>
        </div>
      </Section>
    </>
  );
}
