import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseForm } from "@/components/admin/CourseForm";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { deleteCourse, updateCourse } from "@/app/admin/courses/actions";
import { getCourseById, getFeaturedHomepageCourseCount } from "@/lib/courses";
import { getAllTeachers } from "@/lib/teachers";
import { prisma } from "@/lib/prisma";

export default async function EditCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; created?: string; deleteError?: string; saveError?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const [course, teachers, featuredCount] = await Promise.all([
    getCourseById(id),
    getAllTeachers(),
    getFeaturedHomepageCourseCount(),
  ]);

  if (!course) notFound();

  const enrollmentCount = await prisma.enrollment.count({ where: { courseId: id } });
  const boundUpdate = updateCourse.bind(null, id);
  const boundDelete = deleteCourse.bind(null, id);

  return (
    <div>
      <Link href="/admin/courses" className="text-sm text-primary hover:underline">
        ← Back to courses
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-bold text-primary">Edit course</h1>

      {query.saved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Changes saved.</p>
      )}
      {query.created === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Course created.</p>
      )}
      {query.deleteError && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{query.deleteError}</p>
      )}

      {query.saveError && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{query.saveError}</p>
      )}

      <div className="mt-8">
        <CourseForm
          course={course}
          teachers={teachers}
          featuredCount={featuredCount}
          action={boundUpdate}
          submitLabel="Save changes"
        />
      </div>

      {enrollmentCount === 0 && <DeleteForm action={boundDelete} label="Delete course" />}
    </div>
  );
}
