export type Course = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
};

export const courses: Course[] = [
  {
    id: "quran-nazira",
    title: "Quran Nazira (Reading)",
    description:
      "Learn to read the Holy Quran with correct pronunciation and fluency. Suitable for all ages.",
    startDate: "June 2026",
    level: "Beginner",
    category: "Quran",
  },
  {
    id: "hifz-foundation",
    title: "Hifz Foundation Program",
    description:
      "Structured memorization program with daily revision schedules and qualified supervisors.",
    startDate: "July 2026",
    level: "Intermediate",
    category: "Hifz",
  },
  {
    id: "tajweed-intensive",
    title: "Tajweed Intensive",
    description:
      "Master the rules of Tajweed through guided practice and individual feedback sessions.",
    startDate: "May 2026",
    level: "Advanced",
    category: "Tajweed",
  },
  {
    id: "arabic-grammar",
    title: "Arabic Grammar (Nahw & Sarf)",
    description:
      "Build a strong foundation in classical Arabic grammar for deeper understanding of Islamic texts.",
    startDate: "August 2026",
    level: "Intermediate",
    category: "Arabic",
  },
  {
    id: "fiqh-basics",
    title: "Fiqh Essentials",
    description:
      "Introduction to Hanafi jurisprudence covering worship, transactions, and daily life rulings.",
    startDate: "June 2026",
    level: "Beginner",
    category: "Islamic Studies",
  },
  {
    id: "seerah-youth",
    title: "Seerah for Youth",
    description:
      "Engaging weekly sessions on the life of Prophet Muhammad (peace be upon him) for young learners.",
    startDate: "Ongoing",
    level: "Beginner",
    category: "Seerah",
  },
];
