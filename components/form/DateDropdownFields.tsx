import {
  FORM_DATE_DAYS,
  FORM_DATE_MONTHS,
  type FormDateParts,
} from "@/lib/form-date";
import { formFieldInputClass, formErrorTextClassName } from "@/lib/form-validation";
import { inputClassName, labelClassName } from "@/lib/form";

type DateDropdownFieldsProps = {
  namePrefix: string;
  label: string;
  parts: FormDateParts;
  yearOptions: { value: string; label: string }[];
  required?: boolean;
  className?: string;
  onPartsChange?: (parts: FormDateParts) => void;
  onBlur?: () => void;
  hasError?: boolean;
  errorMessage?: string;
  errorId?: string;
};

export function DateDropdownFields({
  namePrefix,
  label,
  parts,
  yearOptions,
  required = false,
  className = "",
  onPartsChange,
  onBlur,
  hasError = false,
  errorMessage,
  errorId,
}: DateDropdownFieldsProps) {
  const dayName = `${namePrefix}Day`;
  const monthName = `${namePrefix}Month`;
  const yearName = `${namePrefix}Year`;
  const selectClass = formFieldInputClass(hasError);

  function updatePart(key: keyof FormDateParts, value: string) {
    onPartsChange?.({ ...parts, [key]: value });
  }

  return (
    <div className={className}>
      <span className={labelClassName}>{label}</span>
      <div className="mt-1 grid grid-cols-3 gap-2">
        <select
          id={dayName}
          name={dayName}
          required={required}
          value={parts.day}
          onChange={(e) => updatePart("day", e.target.value)}
          onBlur={onBlur}
          className={selectClass}
          aria-label={`${label} day`}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError && errorId ? errorId : undefined}
        >
          <option value="">Day</option>
          {FORM_DATE_DAYS.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
        <select
          id={monthName}
          name={monthName}
          required={required}
          value={parts.month}
          onChange={(e) => updatePart("month", e.target.value)}
          onBlur={onBlur}
          className={selectClass}
          aria-label={`${label} month`}
          aria-invalid={hasError || undefined}
        >
          <option value="">Month</option>
          {FORM_DATE_MONTHS.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <select
          id={yearName}
          name={yearName}
          required={required}
          value={parts.year}
          onChange={(e) => updatePart("year", e.target.value)}
          onBlur={onBlur}
          className={selectClass}
          aria-label={`${label} year`}
          aria-invalid={hasError || undefined}
        >
          <option value="">Year</option>
          {yearOptions.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>
      </div>
      {hasError && errorMessage && (
        <p id={errorId} className={formErrorTextClassName} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
