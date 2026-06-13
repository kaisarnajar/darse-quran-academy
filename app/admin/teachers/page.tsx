import Link from "next/link";
import { DeleteTeacherButton } from "@/components/admin/DeleteTeacherButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getAllTeachers } from "@/lib/teachers";

export default async function AdminTeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; created?: string; saved?: string }>;
}) {
  const params = await searchParams;
  const teachers = await getAllTeachers();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Teachers</h1>
          <p className="mt-1 text-sm text-muted">
            {teachers.length} total — link registered accounts by email to grant the teacher portal.
          </p>
        </div>
        <Link
          href="/admin/teachers/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          Add teacher
        </Link>
      </div>

      {params.created === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Teacher created.</p>
      )}

      {params.deleted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Teacher deleted.</p>
      )}

      {params.saved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Changes saved.</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        {teachers.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No teachers yet.</p>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Teacher</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Registered</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-4 py-3 font-medium text-foreground">{teacher.name}</td>
                  <td className="px-4 py-3 text-muted">{teacher.email ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">
                    {teacher.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge published={teacher.published} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        href={`/admin/teachers/${teacher.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/teachers/${teacher.id}/edit`}
                        className="font-medium text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteTeacherButton
                        id={teacher.id}
                        label={`${teacher.name}${teacher.email ? ` (${teacher.email})` : ""}`}
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
