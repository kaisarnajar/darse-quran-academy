import type { Metadata } from "next";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { getPublishedBlogPosts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and reflections from Darse Quran Academy.",
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <Section>
      <PageHeader
        title="Blog"
        description="Articles, guidance, and updates from our teachers and scholars."
      />

      {posts.length === 0 ? (
        <p className="mt-10 text-center text-muted">No blog posts published yet. Check back soon.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </Section>
  );
}
