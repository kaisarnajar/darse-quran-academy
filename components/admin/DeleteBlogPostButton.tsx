"use client";

import { deleteBlogPost } from "@/app/admin/blogs/actions";

export function DeleteBlogPostButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteBlogPost.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Delete the blog post “${title}”? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-sm font-medium text-red-700 hover:underline"
      >
        Delete
      </button>
    </form>
  );
}
