import Link from "next/link";
import { DeleteContactInquiryButton } from "@/components/admin/DeleteContactInquiryButton";
import { getAllContactInquiries } from "@/lib/contact-inquiries";

function statusLabel(reply: string | null) {
  return reply ? "Replied" : "Pending";
}

function statusClass(reply: string | null) {
  return reply ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900";
}

export default async function AdminContactInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; saved?: string; deleted?: string; error?: string; email?: string }>;
}) {
  const params = await searchParams;
  const filter =
    params.filter === "pending" || params.filter === "replied" ? params.filter : undefined;
  const inquiries = await getAllContactInquiries(filter);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Contact inquiries</h1>
          <p className="mt-1 text-sm text-muted">{inquiries.length} messages</p>
        </div>
        <nav className="flex flex-wrap gap-2" aria-label="Filter inquiries">
          {(
            [
              { label: "All", value: undefined },
              { label: "Pending", value: "pending" as const },
              { label: "Replied", value: "replied" as const },
            ] as const
          ).map((item) => {
            const active = filter === item.value;
            const href = item.value
              ? `/admin/contact-inquiries?filter=${item.value}`
              : "/admin/contact-inquiries";
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
          Reply saved.
          {params.email === "failed"
            ? " The notification email could not be sent — check SMTP settings in your environment."
            : params.email === "skipped"
              ? " SMTP is not configured, so no email was sent."
              : " The visitor has been notified by email."}
        </p>
      )}

      {params.deleted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Inquiry deleted.</p>
      )}

      {params.error === "notfound" && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">Inquiry not found.</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        {inquiries.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No contact messages yet.</p>
        ) : (
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td className="px-4 py-3 font-medium text-foreground">{inquiry.name}</td>
                  <td className="px-4 py-3 text-muted">{inquiry.email}</td>
                  <td className="px-4 py-3 text-muted">{inquiry.phone}</td>
                  <td className="max-w-xs px-4 py-3 text-muted">
                    <p className="line-clamp-2">{inquiry.message}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(inquiry.reply)}`}
                    >
                      {statusLabel(inquiry.reply)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {inquiry.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        href={`/admin/contact-inquiries/${inquiry.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/contact-inquiries/${inquiry.id}/reply`}
                        className="font-medium text-primary hover:underline"
                      >
                        {inquiry.reply ? "Edit" : "Reply"}
                      </Link>
                      <DeleteContactInquiryButton
                        id={inquiry.id}
                        label={`${inquiry.name} (${inquiry.email})`}
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
