import type { Course, Teacher } from "@prisma/client";
import { HOMEPAGE_FEATURED_COURSES_MAX } from "@/lib/courses";
import { getCoursePricingFromCourse, getDefaultFeesForLevel } from "@/lib/course-pricing";
import { COURSE_STATUS_OPTIONS } from "@/lib/course-status";
import { inputClassName, labelClassName } from "@/lib/form";

type CourseFormProps = {
  course?: Course;
  teachers: Teacher[];
  featuredCount: number;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

export function CourseForm({ course, teachers, featuredCount, action, submitLabel }: CourseFormProps) {
  const feeDefaults = course
    ? getCoursePricingFromCourse(course)
    : getDefaultFeesForLevel("Beginner");

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
          <p className="mt-1 text-xs text-muted">Used for display; fees are set below per course.</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 rounded-lg border border-border bg-background/50 p-4">
        <div>
          <label htmlFor="enrollmentFeeInr" className={labelClassName}>
            Enrollment fee (₹)
          </label>
          <input
            id="enrollmentFeeInr"
            name="enrollmentFeeInr"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={feeDefaults.registrationFeeInr}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-muted">Use 0 for free enrollment (student requests access).</p>
        </div>
        <div>
          <label htmlFor="monthlyFeeInr" className={labelClassName}>
            Monthly fee (₹)
          </label>
          <input
            id="monthlyFeeInr"
            name="monthlyFeeInr"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={feeDefaults.monthlyFeeInr}
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-muted">Paid monthly from the student profile after enrollment.</p>
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

      <div className="space-y-3 rounded-lg border border-border bg-background/40 px-4 py-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            name="featuredOnHomepage"
            defaultChecked={course?.featuredOnHomepage ?? false}
            className="mt-1 rounded border-border"
          />
          <span>
            <span className="font-medium">Show on homepage</span>
            <span className="mt-0.5 block text-muted">
              Featured in the Featured Courses section when not in draft (up to{" "}
              {HOMEPAGE_FEATURED_COURSES_MAX}; {featuredCount}/{HOMEPAGE_FEATURED_COURSES_MAX} slots
              used). All public courses still appear on the Courses page.
            </span>
          </span>
        </label>
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
