import Image from "next/image";
import Link from "next/link";
import { ApproveBlogPostButton } from "@/components/admin/ApproveBlogPostButton";
import { RejectBlogPostButton } from "@/components/admin/RejectBlogPostButton";
import { getPendingBlogPostsForAdmin } from "@/lib/blog-approval";

export default async function AdminBlogApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ approved?: string; rejected?: string }>;
}) {
  const params = await searchParams;
  const pendingPosts = await getPendingBlogPostsForAdmin();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Blog approvals</h1>
      <p className="mt-1 text-sm text-muted">
        Review blog posts submitted by teachers before they appear on the public{" "}
        <Link href="/blog" className="font-medium text-primary hover:underline">
          blog page
        </Link>
        . Admin posts are published directly from{" "}
        <Link href="/admin/blogs" className="font-medium text-primary hover:underline">
          Blogs
        </Link>
        .
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

      <div className="mt-8 space-y-6">
        {pendingPosts.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface px-4 py-10 text-center text-sm text-muted">
            No teacher blog posts awaiting approval.
          </p>
        ) : (
          pendingPosts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
            >
              <div className="border-b border-border bg-background/50 px-4 py-3 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-foreground">{post.title}</h2>
                    <p className="mt-1 text-sm text-muted">
                      By {post.createdBy?.name ?? post.createdBy?.email ?? "Teacher"} ·{" "}
                      {post.createdAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ApproveBlogPostButton postId={post.id} />
                    <RejectBlogPostButton postId={post.id} />
                    <Link
                      href={`/admin/blogs/${post.id}/edit`}
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-background"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>

              {post.excerpt && (
                <p className="border-b border-border px-4 py-3 text-sm text-muted sm:px-6">{post.excerpt}</p>
              )}

              <div className="px-4 py-4 sm:px-6">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{post.body}</p>
              </div>

              {post.images.length > 0 && (
                <ul className="grid grid-cols-1 gap-3 border-t border-border px-4 py-4 sm:grid-cols-2 sm:px-6">
                  {post.images.map((img) => (
                    <li key={img.id} className="overflow-hidden rounded-md border border-border">
                      <div className="relative aspect-video bg-background">
                        <Image
                          src={img.imagePath}
                          alt={img.caption ?? ""}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 100vw, 400px"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
