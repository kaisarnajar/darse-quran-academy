import Link from "next/link";
import { CourseForm } from "@/components/admin/CourseForm";
import { createCourse } from "@/app/admin/courses/actions";

export default function NewCoursePage() {
  return (
    <div>
      <Link href="/admin/courses" className="text-sm text-primary hover:underline">
        ← Back to courses
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-bold text-primary">Add course</h1>
      <div className="mt-8">
        <CourseForm action={createCourse} submitLabel="Create course" />
      </div>
    </div>
  );
}
