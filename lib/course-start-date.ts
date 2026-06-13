import {
  FORM_DATE_DAYS,
  FORM_DATE_MONTHS,
  formatFormDate,
  getFormDateFromForm,
  getFormDateParts,
  getFormDateYearOptions,
  type FormDateParts,
} from "@/lib/form-date";

export const COURSE_START_DATE_MONTHS = FORM_DATE_MONTHS;
export const COURSE_START_DATE_DAYS = FORM_DATE_DAYS;
export type CourseStartDateParts = FormDateParts;

export function getCourseStartDateYearOptions(referenceYear = new Date().getFullYear()) {
  return getFormDateYearOptions(referenceYear);
}

export function getCourseStartDateParts(stored?: string | null): CourseStartDateParts {
  return getFormDateParts(stored, { ongoingValue: "ongoing" });
}

export function getCourseStartDateFromForm(formData: FormData): string | null {
  return getFormDateFromForm(formData, "start");
}

export function formatCourseStartDate(day: string, month: string, year: string): string | null {
  return formatFormDate(day, month, year);
}
