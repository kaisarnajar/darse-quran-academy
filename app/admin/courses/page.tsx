import Link from "next/link";
import { CourseStatusBadge } from "@/components/admin/CourseStatusBadge";
import { getCoursePricingFromCourse } from "@/lib/course-pricing";
import { getAllCourses } from "@/lib/courses";
import { getEnrollmentCountsByCourse } from "@/lib/enrollments";

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const params = await searchParams;
  const [courses, enrollmentCounts] = await Promise.all([getAllCourses(), getEnrollmentCountsByCourse()]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Courses</h1>
          <p className="mt-1 text-sm text-muted">{courses.length} total</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          Add course
        </Link>
      </div>

      {params.deleted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Course deleted.</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-background/50 text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Instructor</th>
              <th className="px-4 py-3 font-medium">Fees</th>
              <th className="px-4 py-3 font-medium">Students</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course) => {
              const studentCount = enrollmentCounts.get(course.id) ?? 0;
              const fees = getCoursePricingFromCourse(course);
              return (
                <tr key={course.id}>
                  <td className="px-4 py-3 font-medium text-foreground">{course.title}</td>
                  <td className="px-4 py-3 text-muted">{course.category}</td>
                  <td className="px-4 py-3 text-muted">
                    {course.teacher?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    ₹{fees.registrationFeeInr} reg. · ₹{fees.monthlyFeeInr}/mo
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/courses/${course.id}/students`}
                      className="font-medium text-primary hover:underline"
                    >
                      {studentCount} student{studentCount === 1 ? "" : "s"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <CourseStatusBadge status={course.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/courses/${course.id}/announcements`}
                      className="mr-4 text-primary hover:underline"
                    >
                      Announcements
                    </Link>
                    <Link href={`/admin/courses/${course.id}/edit`} className="text-primary hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
