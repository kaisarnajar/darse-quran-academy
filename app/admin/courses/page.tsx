import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/courses";
import { getAllCourses } from "@/lib/courses";

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const params = await searchParams;
  const courses = await getAllCourses();

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
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-background/50 text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-4 py-3 font-medium text-foreground">{course.title}</td>
                <td className="px-4 py-3 text-muted">{course.category}</td>
                <td className="px-4 py-3 text-muted">{formatPrice(course.priceInrPaise)}</td>
                <td className="px-4 py-3">
                  <StatusBadge published={course.published} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/courses/${course.id}/edit`} className="text-primary hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
