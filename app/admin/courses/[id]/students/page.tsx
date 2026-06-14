import Link from "next/link";
import { notFound } from "next/navigation";
import { RemoveEnrollmentButton } from "@/components/admin/RemoveEnrollmentButton";
import { UploadCertificateButton } from "@/components/admin/UploadCertificateButton";
import { ViewCertificateButton } from "@/components/admin/ViewCertificateButton";
import { CourseStatusBadge } from "@/components/courses/CourseStatusBadge";
import { Pagination } from "@/components/shared/Pagination";
import { getCourseById } from "@/lib/courses";
import { getCourseRosterEnrollmentsPaginated } from "@/lib/enrollments";
import { clampPage, parsePaginationParams } from "@/lib/pagination";

export default async function CourseStudentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const queryParams = await searchParams;
  const course = await getCourseById(id);

  if (!course) notFound();

  const { page: requestedPage, pageSize } = parsePaginationParams(queryParams);
  const { items: enrollments, totalCount } = await getCourseRosterEnrollmentsPaginated(
    course.id,
    course.status,
    requestedPage,
    pageSize,
  );
  const page = clampPage(requestedPage, totalCount, pageSize);

  const isCompletedCourse = course.status === "COMPLETED";
  const rosterLabel = isCompletedCourse ? "completed students" : "active students";

  return (
    <div>
      <Link href="/admin/courses" className="text-sm text-primary hover:underline">
        ← Back to courses
      </Link>

      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-bold text-primary">Students</h1>
          <CourseStatusBadge status={course.status} />
        </div>
        <p className="mt-1 text-sm text-muted">
          <span className="font-medium text-foreground">{course.title}</span>
          {" · "}
          {totalCount} {rosterLabel}
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        {totalCount === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            {isCompletedCourse
              ? "No completed students for this course yet."
              : "No active students enrolled in this course yet."}
          </p>
        ) : (
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="w-[1%] whitespace-nowrap px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {enrollment.user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{enrollment.user.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isCompletedCourse && (
                        <>
                          {enrollment.uploadedCertificatePath && (
                            <ViewCertificateButton enrollmentId={enrollment.id} />
                          )}
                          <UploadCertificateButton
                            enrollmentId={enrollment.id}
                            courseId={id}
                            hasCertificate={Boolean(enrollment.uploadedCertificatePath)}
                          />
                        </>
                      )}
                      <RemoveEnrollmentButton
                        enrollmentId={enrollment.id}
                        courseId={id}
                        studentLabel={enrollment.user.name ?? enrollment.user.email}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        basePath={`/admin/courses/${id}/students`}
        params={queryParams}
        page={page}
        totalCount={totalCount}
        pageSize={pageSize}
      />
    </div>
  );
}
