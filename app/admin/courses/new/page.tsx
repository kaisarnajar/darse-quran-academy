import Link from "next/link";
import { CourseForm } from "@/components/admin/CourseForm";
import { createCourse } from "@/app/admin/courses/actions";
import { getAllTeachers } from "@/lib/teachers";

export default async function NewCoursePage() {
  const teachers = await getAllTeachers();

  return (
    <div>
      <Link href="/admin/courses" className="text-sm text-primary hover:underline">
        ← Back to courses
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-bold text-primary">Add course</h1>
      {teachers.length === 0 ? (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Add at least one teacher before creating a course.{" "}
          <Link href="/admin/teachers/new" className="font-medium text-primary hover:underline">
            Add teacher
          </Link>
        </p>
      ) : (
        <div className="mt-8">
          <CourseForm teachers={teachers} action={createCourse} submitLabel="Create course" />
        </div>
      )}
    </div>
  );
}
