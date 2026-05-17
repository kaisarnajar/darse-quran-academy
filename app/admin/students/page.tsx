import Link from "next/link";
import { DeleteStudentButton } from "@/components/admin/DeleteStudentButton";
import { enrollmentStatusLabel } from "@/lib/enrollments";
import { getAllCourses } from "@/lib/courses";
import { getStudentUsers } from "@/lib/students";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const params = await searchParams;
  const [students, courses] = await Promise.all([getStudentUsers(), getAllCourses()]);
  const titleById = new Map(courses.map((c) => [c.id, c.title]));

  return (
    <div>
      <div>
        <h1 className="font-serif text-2xl font-bold text-primary">Students</h1>
        <p className="mt-1 text-sm text-muted">
          Registered student accounts and their course enrollments. You can remove individual enrollments
          on a student&apos;s profile or delete the entire account.
        </p>
      </div>

      {params.deleted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Student account deleted.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        {students.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No student accounts yet.</p>
        ) : (
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Courses</th>
                <th className="px-4 py-3 font-medium">Registered</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{student.name ?? "—"}</p>
                    <p className="text-xs text-muted">{student.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {student.enrollments.length === 0 ? (
                      <span className="text-muted">No enrollments</span>
                    ) : (
                      <ul className="space-y-1.5">
                        {student.enrollments.map((enrollment) => (
                          <li key={enrollment.id} className="text-foreground">
                            <span>{titleById.get(enrollment.courseId) ?? enrollment.courseId}</span>
                            <span className="ml-1.5 text-xs text-muted">
                              ({enrollmentStatusLabel(enrollment.status)})
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {student.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
                      <DeleteStudentButton
                        id={student.id}
                        label={`${student.name ?? student.email} (${student.email})`}
                      />
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
