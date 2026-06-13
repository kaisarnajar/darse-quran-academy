import {
  getFormDateFromForm,
  getFormDateParts,
  getFormDateYearOptions,
  type FormDateParts,
} from "@/lib/form-date";

export function getCourseStartDateYearOptions(referenceYear = new Date().getFullYear()) {
  return getFormDateYearOptions(referenceYear);
}

export function getCourseStartDateParts(stored?: string | null): FormDateParts {
  return getFormDateParts(stored, { ongoingValue: "ongoing" });
}

export function getCourseStartDateFromForm(formData: FormData): string | null {
  return getFormDateFromForm(formData, "start");
}
