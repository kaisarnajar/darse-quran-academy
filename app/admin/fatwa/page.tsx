import Link from "next/link";
import { getAllFatwaQuestions } from "@/lib/fatwa";

function statusLabel(answer: string | null) {
  return answer ? "Answered" : "Pending";
}

function statusClass(answer: string | null) {
  return answer ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900";
}

export default async function AdminFatwaPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; saved?: string }>;
}) {
  const params = await searchParams;
  const filter =
    params.filter === "pending" || params.filter === "answered" ? params.filter : undefined;
  const questions = await getAllFatwaQuestions(filter);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Fatwa Q&A</h1>
          <p className="mt-1 text-sm text-muted">{questions.length} questions</p>
        </div>
        <nav className="flex flex-wrap gap-2" aria-label="Filter questions">
          {(
            [
              { label: "All", value: undefined },
              { label: "Pending", value: "pending" as const },
              { label: "Answered", value: "answered" as const },
            ] as const
          ).map((item) => {
            const active = filter === item.value;
            const href = item.value ? `/admin/fatwa?filter=${item.value}` : "/admin/fatwa";
            return (
              <Link
                key={item.label}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  active ? "bg-primary text-white" : "border border-border text-foreground hover:bg-accent-muted/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {params.saved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Answer saved and notification sent (or logged if SMTP is not configured).
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        {questions.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No questions yet.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Asker</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {questions.map((q) => (
                <tr key={q.id}>
                  <td className="px-4 py-3 font-medium text-foreground">{q.title}</td>
                  <td className="px-4 py-3 text-muted">{q.category}</td>
                  <td className="px-4 py-3">
                    <p className="text-foreground">{q.askerName}</p>
                    <p className="text-xs text-muted">{q.askerEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(q.answer)}`}
                    >
                      {statusLabel(q.answer)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {q.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/fatwa/${q.id}`} className="font-medium text-primary hover:underline">
                      {q.answer ? "View" : "Answer"}
                    </Link>
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
