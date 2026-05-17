import Link from "next/link";
import { TeacherForm } from "@/components/admin/TeacherForm";
import { createTeacher } from "@/app/admin/teachers/actions";

export default function NewTeacherPage() {
  return (
    <div>
      <Link href="/admin/teachers" className="text-sm text-primary hover:underline">
        ← Back to teachers
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-bold text-primary">Add teacher</h1>
      <div className="mt-8">
        <TeacherForm action={createTeacher} submitLabel="Create teacher" />
      </div>
    </div>
  );
}
