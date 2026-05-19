import Link from "next/link";
import { notFound } from "next/navigation";
import { updateBlogPost } from "@/app/admin/blogs/actions";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { DeleteBlogPostButton } from "@/components/admin/DeleteBlogPostButton";
import { getBlogPostForAdmin } from "@/lib/blogs";

export default async function EditBlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; posted?: string; error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const post = await getBlogPostForAdmin(id);

  if (!post) notFound();

  const action = updateBlogPost.bind(null, id);

  return (
    <div>
      <Link href="/admin/blogs" className="text-sm text-primary hover:underline">
        ← Back to blogs
      </Link>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="font-serif text-2xl font-bold text-primary">Edit blog post</h1>
        <DeleteBlogPostButton id={post.id} title={post.title} />
      </div>

      {query.saved === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Changes saved.</p>
      )}
      {query.posted === "1" && (
        <p className="mt-4 rounded-md bg-violet-50 px-4 py-3 text-sm text-violet-800">Blog post created.</p>
      )}

      <div className="mt-8">
        <BlogPostForm
          post={post}
          action={action}
          submitLabel="Save changes"
          error={query.error ? decodeURIComponent(query.error) : undefined}
        />
      </div>
    </div>
  );
}
