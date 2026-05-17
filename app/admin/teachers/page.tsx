import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getAllTeachers } from "@/lib/teachers";

export default async function AdminTeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const params = await searchParams;
  const teachers = await getAllTeachers();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Teachers</h1>
          <p className="mt-1 text-sm text-muted">{teachers.length} total</p>
        </div>
        <Link
          href="/admin/teachers/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          Add teacher
        </Link>
      </div>

      {params.deleted === "1" && (
        <p className="mt-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">Teacher deleted.</p>
      )}

      <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
        {teachers.map((teacher) => (
          <li key={teacher.id} className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <p className="font-medium text-foreground">{teacher.name}</p>
              <p className="text-sm text-muted">{teacher.specialization}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge published={teacher.published} />
              <Link href={`/admin/teachers/${teacher.id}/edit`} className="text-sm text-primary hover:underline">
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
