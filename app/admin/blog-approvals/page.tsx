import Link from "next/link";
import { ApproveBlogPostButton } from "@/components/admin/ApproveBlogPostButton";
import { RejectBlogPostButton } from "@/components/admin/RejectBlogPostButton";
import { getPendingBlogPostsForAdmin } from "@/lib/blog-approval";

export default async function AdminBlogApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ approved?: string; rejected?: string; saved?: string }>;
}) {
  const params = await searchParams;
  const pendingPosts = await getPendingBlogPostsForAdmin();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Blog approvals</h1>
      <p className="mt-1 text-sm text-muted">
        Review blog posts submitted by teachers before they appear on the public blog page. Admin posts are
        published directly from Blogs.
      </p>

      {params.approved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">
          Blog post approved and published.
        </p>
      )}
      {params.rejected === "1" && (
        <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Blog post rejected. The teacher can edit and resubmit.
        </p>
      )}
      {params.saved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Changes saved.</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        {pendingPosts.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">No teacher blog posts awaiting approval.</p>
        ) : (
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-border bg-background/50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Submitted by</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Images</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pendingPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-3 font-medium text-foreground">{post.title}</td>
                  <td className="px-4 py-3 text-muted">{post.createdBy?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{post.createdBy?.email ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{post.images.length}</td>
                  <td className="px-4 py-3 text-muted">
                    {post.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog-approvals/${post.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/blogs/${post.id}/edit`}
                        className="font-medium text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <ApproveBlogPostButton postId={post.id} />
                      <RejectBlogPostButton postId={post.id} />
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
