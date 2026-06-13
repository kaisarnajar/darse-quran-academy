export const FORM_DATE_MONTHS = [
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

export const FORM_DATE_DAYS = Array.from({ length: 31 }, (_, index) => {
  const value = String(index + 1).padStart(2, "0");
  return { value, label: String(index + 1) };
});

export function getFormDateYearOptions(referenceYear = new Date().getFullYear()) {
  const years: { value: string; label: string }[] = [];
  for (let year = referenceYear - 1; year <= referenceYear + 5; year += 1) {
    years.push({ value: String(year), label: String(year) });
  }
  return years;
}

export type FormDateParts = {
  day: string;
  month: string;
  year: string;
};

const EMPTY_DATE_PARTS: FormDateParts = {
  day: "",
  month: "",
  year: "",
};

function partsFromDate(date: Date): FormDateParts {
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: String(date.getMonth() + 1).padStart(2, "0"),
    year: String(date.getFullYear()),
  };
}

function normalizeStoredDateValue(stored?: string | null): string {
  const value = stored?.trim();
  if (!value) return "";

  if (value.includes(" / ")) {
    const segments = value.split(" / ").map((segment) => segment.trim());
    const gregorian = segments.find((segment) =>
      FORM_DATE_MONTHS.some((month) => segment.toLowerCase().includes(month.label.toLowerCase())),
    );
    return gregorian ?? segments[segments.length - 1] ?? value;
  }

  return value;
}

export function getFormDateParts(stored?: string | null, options?: { ongoingValue?: string }): FormDateParts {
  const value = normalizeStoredDateValue(stored);
  if (!value || (options?.ongoingValue && value.toLowerCase() === options.ongoingValue.toLowerCase())) {
    return EMPTY_DATE_PARTS;
  }

  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return partsFromDate(new Date(parsed));
  }

  const dayMonthYearMatch = value.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (dayMonthYearMatch) {
    const month = FORM_DATE_MONTHS.find(
      (entry) => entry.label.toLowerCase() === dayMonthYearMatch[2].toLowerCase(),
    );
    if (month) {
      return {
        day: String(Number(dayMonthYearMatch[1])).padStart(2, "0"),
        month: month.value,
        year: dayMonthYearMatch[3],
      };
    }
  }

  const monthYearMatch = value.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYearMatch) {
    const month = FORM_DATE_MONTHS.find(
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

  return EMPTY_DATE_PARTS;
}

export function formatFormDate(day: string, month: string, year: string): string | null {
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

export function getFormDatePartsFromForm(formData: FormData, namePrefix: string): FormDateParts {
  return {
    day: String(formData.get(`${namePrefix}Day`) ?? "").trim(),
    month: String(formData.get(`${namePrefix}Month`) ?? "").trim(),
    year: String(formData.get(`${namePrefix}Year`) ?? "").trim(),
  };
}

export function getFormDateFromForm(formData: FormData, namePrefix: string): string | null {
  const parts = getFormDatePartsFromForm(formData, namePrefix);
  return formatFormDate(parts.day, parts.month, parts.year);
}

export function hasPartialFormDate(parts: FormDateParts): boolean {
  return Boolean(parts.day || parts.month || parts.year);
}
