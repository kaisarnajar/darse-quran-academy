import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseStatusBadge } from "@/components/admin/CourseStatusBadge";
import { requireTeacher } from "@/lib/auth-actions";
import { formatPrice } from "@/lib/courses";
import { enrollmentStatusClass, enrollmentStatusLabel } from "@/lib/enrollments";
import { getTeacherCourseStudents } from "@/lib/teacher-portal";
import { prisma } from "@/lib/prisma";

export default async function TeacherCourseStudentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { teacher } = await requireTeacher();
  const data = await getTeacherCourseStudents(teacher.id, id);

  if (!data) notFound();

  const { course, enrollments } = data;

  const profileByUser = new Map(
    (
      await prisma.user.findMany({
        where: { id: { in: enrollments.map((e) => e.user.id) } },
        select: {
          id: true,
          fatherName: true,
          whatsapp: true,
          address: true,
        },
      })
    ).map((u) => [u.id, u]),
  );

  return (
    <div>
      <Link href="/teacher" className="text-sm font-medium text-teal hover:underline">
        ← My courses
      </Link>

      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <CourseStatusBadge status={course.status} />
          <span className="text-xs font-semibold uppercase tracking-wide text-gold">{course.category}</span>
        </div>
        <h1 className="mt-2 font-serif text-2xl font-bold text-foreground">{course.title}</h1>
        <p className="mt-1 text-sm text-muted">
          {course.level} · Starts {course.startDate} · {enrollments.length} student
          {enrollments.length === 1 ? "" : "s"}
        </p>
      </div>

      <p className="mt-4 rounded-lg border border-teal/20 bg-teal/5 px-4 py-3 text-sm text-teal-dark">
        This is a read-only view. To change enrollments or payments, contact the academy admin.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
        {enrollments.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">No students enrolled in this course yet.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-background/60 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Enrollment status</th>
                <th className="px-4 py-3 font-medium">Enrolled</th>
                <th className="px-4 py-3 font-medium">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enrollments.map((enrollment) => {
                const profile = profileByUser.get(enrollment.user.id);
                return (
                  <tr key={enrollment.id} className="hover:bg-background/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{enrollment.user.name ?? "—"}</p>
                      {profile?.fatherName && (
                        <p className="text-xs text-muted">Father: {profile.fatherName}</p>
                      )}
                      {profile?.address && (
                        <p className="mt-0.5 text-xs text-muted">{profile.address}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      <p>{enrollment.user.email}</p>
                      {profile?.whatsapp && <p className="text-xs">WhatsApp: {profile.whatsapp}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${enrollmentStatusClass(enrollment.status)}`}
                      >
                        {enrollmentStatusLabel(enrollment.status)}
                      </span>
                      {enrollment.amountPaid != null && (
                        <p className="mt-1 text-xs text-muted">Paid {formatPrice(enrollment.amountPaid)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {enrollment.createdAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {enrollment.completedAt
                        ? enrollment.completedAt.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
