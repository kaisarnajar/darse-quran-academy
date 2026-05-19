import type { BlogPostWithImages } from "@/lib/blogs";
import { formatBlogDate } from "@/lib/blogs";
import Image from "next/image";
import Link from "next/link";

type BlogPostCardProps = {
  post: BlogPostWithImages;
};

export function BlogPostCard({ post }: BlogPostCardProps) {
  const cover = post.images[0];
  const summary = post.excerpt || post.body.slice(0, 160) + (post.body.length > 160 ? "…" : "");

  return (
    <article className="card-elevated flex h-full flex-col overflow-hidden transition-transform hover:-translate-y-0.5">
      {cover && (
        <Link href={`/blog/${post.id}`} className="relative block aspect-[16/10] bg-background">
          <Image
            src={cover.imagePath}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-muted">{formatBlogDate(post.createdAt)}</p>
        <h2 className="mt-2 font-serif text-lg font-semibold text-foreground">
          <Link href={`/blog/${post.id}`} className="hover:text-gold">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{summary}</p>
        <Link
          href={`/blog/${post.id}`}
          className="mt-4 text-sm font-semibold text-primary hover:underline"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}
