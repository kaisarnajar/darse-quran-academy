export const courseCategoryGradients: Record<string, string> = {
  Quran: "from-teal-800 to-teal-600",
  Tajweed: "from-amber-800 to-amber-600",
  Arabic: "from-slate-700 to-slate-500",
  Islamic: "from-emerald-800 to-emerald-600",
  default: "from-stone-700 to-stone-500",
};

export const courseLevelColors: Record<string, string> = {
  Beginner: "bg-amber-100 text-amber-900",
  Intermediate: "bg-stone-200 text-stone-800",
  Advanced: "bg-teal-100 text-teal-900",
};

export function getCourseBannerClass(category: string): string {
  const key = Object.keys(courseCategoryGradients).find((k) =>
    category.toLowerCase().includes(k.toLowerCase()),
  );
  return courseCategoryGradients[key ?? "default"];
}

export function getCourseLevelClass(level: string): string {
  return courseLevelColors[level] ?? "bg-slate-100 text-slate-800";
}
