import type { Metadata } from "next";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { Pagination } from "@/components/shared/Pagination";
import { getPublishedBlogPostsPaginated } from "@/lib/blogs";
import { GRID_PAGE_SIZE, clampPage, parsePaginationParams } from "@/lib/pagination";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and reflections from Darse Quran Academy.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const { page: requestedPage, pageSize } = parsePaginationParams(params, {
    pageSize: GRID_PAGE_SIZE,
  });
  const { items: posts, totalCount } = await getPublishedBlogPostsPaginated(
    requestedPage,
    pageSize,
  );
  const page = clampPage(requestedPage, totalCount, pageSize);

  return (
    <Section>
      <PageHeader
        title="Blog"
        description="Articles, guidance, and updates from our teachers and scholars."
      />

      {totalCount === 0 ? (
        <p className="mt-10 text-center text-muted">No blog posts published yet. Check back soon.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <Pagination
        basePath="/blog"
        params={params}
        page={page}
        totalCount={totalCount}
        pageSize={pageSize}
      />
    </Section>
  );
}
