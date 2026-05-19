import type { Course, Teacher } from "@prisma/client";
import { getCoursePricing } from "@/lib/course-pricing";
import type { CourseLevel } from "@/lib/courses";
import { COURSE_STATUS_OPTIONS } from "@/lib/course-status";
import { inputClassName, labelClassName } from "@/lib/form";

type CourseFormProps = {
  course?: Course;
  teachers: Teacher[];
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

export function CourseForm({ course, teachers, action, submitLabel }: CourseFormProps) {
  return (
    <form action={action} className="mx-auto max-w-2xl space-y-5">
      <div>
        <label htmlFor="title" className={labelClassName}>
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={course?.title}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClassName}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={course?.description}
          className={inputClassName}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className={labelClassName}>
            Start date
          </label>
          <input
            id="startDate"
            name="startDate"
            required
            defaultValue={course?.startDate}
            placeholder="e.g. June 2026"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="category" className={labelClassName}>
            Category
          </label>
          <input
            id="category"
            name="category"
            required
            defaultValue={course?.category}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="teacherId" className={labelClassName}>
          Instructor
        </label>
        <select
          id="teacherId"
          name="teacherId"
          required
          defaultValue={course?.teacherId ?? ""}
          className={inputClassName}
        >
          <option value="" disabled>
            Select a teacher
          </option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name} — {teacher.specialization}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="level" className={labelClassName}>
            Level
          </label>
          <select id="level" name="level" defaultValue={course?.level ?? "Beginner"} className={inputClassName}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className="flex flex-col justify-end rounded-md border border-border bg-background/50 px-3 py-3 text-xs leading-relaxed text-muted">
          <p className="font-medium text-foreground">Fees (by level)</p>
          <ul className="mt-2 space-y-1">
            {(["Beginner", "Intermediate", "Advanced"] as CourseLevel[]).map((level) => {
              const fees = getCoursePricing(level);
              return (
                <li key={level}>
                  <span className="font-medium text-foreground">{level}:</span> Reg. ₹
                  {fees.registrationFeeInr}, ₹{fees.monthlyFeeInr}/mo
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div>
        <label htmlFor="status" className={labelClassName}>
          Course status
        </label>
        <select
          id="status"
          name="status"
          required
          defaultValue={course?.status ?? "PUBLISHED"}
          className={inputClassName}
        >
          {COURSE_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} title={option.description}>
              {option.label} — {option.description}
            </option>
          ))}
        </select>
      </div>

      {course && (
        <p className="text-xs text-muted">
          Course ID: <code className="rounded bg-background px-1">{course.id}</code>
        </p>
      )}

      <button
        type="submit"
        className="min-h-11 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
      >
        {submitLabel}
      </button>
    </form>
  );
}
