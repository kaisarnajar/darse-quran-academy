import type { Course } from "@prisma/client";
import { inputClassName, labelClassName, paiseToRupees } from "@/lib/form";

type CourseFormProps = {
  course?: Course;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

export function CourseForm({ course, action, submitLabel }: CourseFormProps) {
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
        <div>
          <label htmlFor="priceRupees" className={labelClassName}>
            Price (INR)
          </label>
          <input
            id="priceRupees"
            name="priceRupees"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={course ? paiseToRupees(course.priceInrPaise) : undefined}
            className={inputClassName}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={course?.published ?? true}
          className="h-4 w-4 rounded border-border"
        />
        Published (visible on public site)
      </label>

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
