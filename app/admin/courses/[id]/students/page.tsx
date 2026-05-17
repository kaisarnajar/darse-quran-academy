import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmPaymentButton } from "@/components/admin/ConfirmPaymentButton";
import { formatPrice, getCourseById } from "@/lib/courses";
import { getEnrollmentsForCourse } from "@/lib/enrollments";

function statusClass(status: string) {
  if (status === "active") return "bg-violet-100 text-violet-800";
  if (status === "pending_verification") return "bg-amber-100 text-amber-900";
  if (status === "pending") return "bg-stone-200 text-stone-700";
  return "bg-stone-200 text-stone-700";
}

function statusLabel(status: string) {
  if (status === "pending_verification") return "Awaiting verification";
  return status.replace(/_/g, " ");
}

export default async function CourseStudentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [course, enrollments] = await Promise.all([getCourseById(id), getEnrollmentsForCourse(id)]);

  if (!course) notFound();

  const activeCount = enrollments.filter((e) => e.status === "active").length;

  return (
    <div>
      <Link href="/admin/courses" className="text-sm text-primary hover:underline">
        ← Back to courses
      </Link>
      <Link href={`/admin/courses/${id}/edit`} className="ml-4 text-sm text-muted hover:text-primary">
        Edit course
      </Link>

      <h1 className="mt-4 font-serif text-2xl font-bold text-primary">Students</h1>
      <p className="mt-1 text-sm text-muted">
        <span className="font-medium text-foreground">{course.title}</span>
        {" · "}
        {activeCount} active · {enrollments.length} total
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        {enrollments.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No students enrolled in this course yet.</p>
        ) : (
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">UPI UTR</th>
                <th className="px-4 py-3 font-medium">Paid</th>
                <th className="px-4 py-3 font-medium">Enrolled</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {enrollment.user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{enrollment.user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusClass(enrollment.status)}`}
                    >
                      {statusLabel(enrollment.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {enrollment.upiTransactionId ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {enrollment.amountPaid != null ? formatPrice(enrollment.amountPaid) : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {enrollment.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {enrollment.status === "pending_verification" && (
                      <ConfirmPaymentButton enrollmentId={enrollment.id} courseId={id} />
                    )}
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
