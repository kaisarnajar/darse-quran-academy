import { courses, type Course } from "@/content/courses";

export type { Course };
export { courses };

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function formatPrice(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}
