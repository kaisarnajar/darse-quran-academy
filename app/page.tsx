import Link from "next/link";
import { Section } from "@/components/site/Section";
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
        <Section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Bismillah ir-Rahman ir-Rahim
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-primary sm:text-5xl">
              Authentic Islamic Education for Every Seeker
            </h1>
            <p className="mt-6 text-lg text-muted">
              Darse Quran Academy offers Quran recitation, memorization, Tajweed, Arabic, and Islamic
              studies—guided by experienced scholars, in the tradition of Deoband.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/courses"
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
              >
                View Course Announcements
              </Link>
              <Link
                href="/about"
                className="rounded-md border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                About Us
              </Link>
            </div>
          </div>
        </Section>
      </section>

      <Section>
        <h2 className="text-center font-serif text-2xl font-bold text-foreground">Why Choose Us</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-surface p-6 text-center shadow-sm"
            >
              <span className="text-3xl" aria-hidden>
                {feature.icon}
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-primary">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-surface/50">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Latest Course Announcements</h2>
            <p className="mt-2 text-muted">Enroll in our upcoming programs</p>
          </div>
          <Link href="/courses" className="shrink-0 text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <li key={course.id} className="rounded-lg border border-border bg-surface p-5">
              <span className="text-xs font-medium text-accent">{course.category}</span>
              <h3 className="mt-1 font-serif font-semibold text-foreground">{course.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{course.description}</p>
              <p className="mt-3 text-xs font-medium text-primary">Starts {course.startDate}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Our Teachers</h2>
            <p className="mt-2 text-muted">Dedicated scholars guiding your learning journey</p>
          </div>
          <Link href="/teachers" className="shrink-0 text-sm font-medium text-primary hover:underline">
            Meet all teachers →
          </Link>
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTeachers.map((teacher) => (
            <li
              key={teacher.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-surface p-5"
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
                aria-hidden
              >
                {teacher.initials}
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground">{teacher.name}</h3>
                <p className="text-sm text-accent">{teacher.specialization}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-border bg-primary text-white">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold">Explore Our Digital Library</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Access curated Islamic books and study materials—Quran, Hadith, Fiqh, and more.
          </p>
          <Link
            href="/library"
            className="mt-6 inline-block rounded-md bg-accent px-6 py-3 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
          >
            Browse Library
          </Link>
        </div>
      </Section>
    </>
  );
}
