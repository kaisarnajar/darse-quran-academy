"use client";

import { deleteTeacherBlogPost } from "@/app/teacher/(portal)/blogs/actions";

export function DeleteTeacherBlogPostButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteTeacherBlogPost.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Delete “${title}”? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-sm font-medium text-red-700 hover:underline">
        Delete
      </button>
    </form>
  );
}
