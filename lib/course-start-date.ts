export const COURSE_START_DATE_MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
] as const;

export const COURSE_START_DATE_DAYS = Array.from({ length: 31 }, (_, index) => {
  const value = String(index + 1).padStart(2, "0");
  return { value, label: String(index + 1) };
});

export function getCourseStartDateYearOptions(referenceYear = new Date().getFullYear()) {
  const years: { value: string; label: string }[] = [];
  for (let year = referenceYear - 1; year <= referenceYear + 5; year += 1) {
    years.push({ value: String(year), label: String(year) });
  }
  return years;
}

export type CourseStartDateParts = {
  day: string;
  month: string;
  year: string;
};

const EMPTY_START_DATE_PARTS: CourseStartDateParts = {
  day: "",
  month: "",
  year: "",
};

function partsFromDate(date: Date): CourseStartDateParts {
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: String(date.getMonth() + 1).padStart(2, "0"),
    year: String(date.getFullYear()),
  };
}

export function getCourseStartDateParts(stored?: string | null): CourseStartDateParts {
  const value = stored?.trim();
  if (!value || value.toLowerCase() === "ongoing") {
    return EMPTY_START_DATE_PARTS;
  }

  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return partsFromDate(new Date(parsed));
  }

  const monthYearMatch = value.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYearMatch) {
    const month = COURSE_START_DATE_MONTHS.find(
      (entry) => entry.label.toLowerCase() === monthYearMatch[1].toLowerCase(),
    );
    if (month) {
      return {
        day: "01",
        month: month.value,
        year: monthYearMatch[2],
      };
    }
  }

  return EMPTY_START_DATE_PARTS;
}

export function formatCourseStartDate(day: string, month: string, year: string): string | null {
  const dayNum = Number(day);
  const monthNum = Number(month);
  const yearNum = Number(year);

  if (!dayNum || !monthNum || !yearNum) {
    return null;
  }

  const date = new Date(yearNum, monthNum - 1, dayNum);
  if (
    date.getFullYear() !== yearNum ||
    date.getMonth() !== monthNum - 1 ||
    date.getDate() !== dayNum
  ) {
    return null;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getCourseStartDateFromForm(formData: FormData): string | null {
  return formatCourseStartDate(
    String(formData.get("startDay") ?? "").trim(),
    String(formData.get("startMonth") ?? "").trim(),
    String(formData.get("startYear") ?? "").trim(),
  );
}
