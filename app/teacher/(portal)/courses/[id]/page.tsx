import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTeacher } from "@/lib/auth-actions";
import { getTeacherCourseStudents } from "@/lib/teacher-portal";

export default async function TeacherCourseStudentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { teacher } = await requireTeacher();
  const data = await getTeacherCourseStudents(teacher.id, id);

  if (!data) notFound();

  const { enrollments } = data;

  return (
    <div>
      <p className="text-sm text-muted">
        {enrollments.length} student{enrollments.length === 1 ? "" : "s"} enrolled
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
        {enrollments.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">No students enrolled in this course yet.</p>
        ) : (
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead className="border-b border-border bg-background/60 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-background/30">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {enrollment.user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <Link
                        href={`/teacher/courses/${id}/students/${enrollment.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/teacher/courses/${id}/students/${enrollment.id}/announcements`}
                        className="font-medium text-primary hover:underline"
                      >
                        Message
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
