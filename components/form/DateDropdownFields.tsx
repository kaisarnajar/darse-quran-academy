import {
  FORM_DATE_DAYS,
  FORM_DATE_MONTHS,
  type FormDateParts,
} from "@/lib/form-date";
import { inputClassName, labelClassName } from "@/lib/form";

type DateDropdownFieldsProps = {
  namePrefix: string;
  label: string;
  parts: FormDateParts;
  yearOptions: { value: string; label: string }[];
  required?: boolean;
  className?: string;
};

export function DateDropdownFields({
  namePrefix,
  label,
  parts,
  yearOptions,
  required = false,
  className = "",
}: DateDropdownFieldsProps) {
  const dayName = `${namePrefix}Day`;
  const monthName = `${namePrefix}Month`;
  const yearName = `${namePrefix}Year`;

  return (
    <div className={className}>
      <span className={labelClassName}>{label}</span>
      <div className="mt-1 grid grid-cols-3 gap-2">
        <select
          id={dayName}
          name={dayName}
          required={required}
          defaultValue={parts.day}
          className={inputClassName}
          aria-label={`${label} day`}
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
          defaultValue={parts.month}
          className={inputClassName}
          aria-label={`${label} month`}
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
          defaultValue={parts.year}
          className={inputClassName}
          aria-label={`${label} year`}
        >
          <option value="">Year</option>
          {yearOptions.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
