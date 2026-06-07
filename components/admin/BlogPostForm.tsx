import type { BlogImage } from "@prisma/client";
import Image from "next/image";
import { HOMEPAGE_FEATURED_BLOGS_MAX } from "@/lib/blogs";
import { MAX_BLOG_IMAGES } from "@/lib/blog-upload";
import { inputClassName, labelClassName } from "@/lib/form";

type BlogPostFormPost = {
  title: string;
  excerpt: string | null;
  body: string;
  published: boolean;
  featuredOnHomepage?: boolean;
  images: BlogImage[];
};

type BlogPostFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  post?: BlogPostFormPost;
  featuredCount?: number;
  error?: string;
  /** Teachers submit for admin approval; publish checkbox is hidden. */
  mode?: "admin" | "teacher";
};

export function BlogPostForm({
  action,
  submitLabel,
  post,
  featuredCount = 0,
  error,
  mode = "admin",
}: BlogPostFormProps) {
  const isTeacher = mode === "teacher";
  const imageCount = post?.images.length ?? 0;
  const slotsLeft = MAX_BLOG_IMAGES - imageCount;

  return (
    <form action={action} encType="multipart/form-data" className="mx-auto max-w-2xl space-y-5">
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="title" className={labelClassName}>
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          defaultValue={post?.title ?? ""}
          placeholder="e.g. Tips for memorizing Quran with tajweed"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="excerpt" className={labelClassName}>
          Short summary (optional)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          maxLength={400}
          defaultValue={post?.excerpt ?? ""}
          placeholder="A brief line shown on the blog listing page…"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="body" className={labelClassName}>
          Blog content
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={14}
          defaultValue={post?.body ?? ""}
          placeholder="Write your article here. You can add screenshots below."
          className={inputClassName}
        />
      </div>

      {post && post.images.length > 0 && (
        <div>
          <p className={labelClassName}>Screenshots & photos</p>
          <ul className="mt-2 space-y-4">
            {post.images.map((img) => (
              <li
                key={img.id}
                className="overflow-hidden rounded-lg border border-border bg-background/50"
              >
                <div className="relative aspect-video max-h-48 w-full bg-background">
                  <Image
                    src={img.imagePath}
                    alt={img.caption ?? ""}
                    fill
                    className="object-contain"
                    sizes="(max-width: 672px) 100vw, 672px"
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    name="removeImage"
                    value={img.id}
                    className="rounded border-border"
                  />
                  Remove this image
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="images" className={labelClassName}>
          {post ? "Add more images" : "Screenshots & photos (optional)"}
        </label>
        <input
          id="images"
          name="images"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary"
        />
        <p className="mt-1.5 text-xs text-muted">
          JPEG, PNG, WebP, or GIF — up to 5 MB each.{" "}
          {post
            ? `You can add ${slotsLeft} more image${slotsLeft === 1 ? "" : "s"} (max ${MAX_BLOG_IMAGES} total).`
            : `Up to ${MAX_BLOG_IMAGES} images per post.`}
        </p>
      </div>

      {isTeacher ? (
        <p className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Your post will be sent to the admin for review. Once approved, it will appear on the public
          blog page.
        </p>
      ) : (
        <div className="space-y-3 rounded-lg border border-border bg-background/40 px-4 py-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published ?? false}
              className="mt-1 rounded border-border"
            />
            <span>
              <span className="font-medium">Publish on the public blog</span>
              <span className="mt-0.5 block text-muted">Leave unchecked to save as a draft.</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              name="featuredOnHomepage"
              defaultChecked={post?.featuredOnHomepage ?? false}
              className="mt-1 rounded border-border"
            />
            <span>
              <span className="font-medium">Show on homepage</span>
              <span className="mt-0.5 block text-muted">
                Featured in the Featured Blogs section when published (up to {HOMEPAGE_FEATURED_BLOGS_MAX};{" "}
                {featuredCount}/{HOMEPAGE_FEATURED_BLOGS_MAX} slots used). All published posts still appear on
                the Blog page.
              </span>
            </span>
          </label>
        </div>
      )}

      <button
        type="submit"
        className="min-h-11 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
      >
        {submitLabel}
      </button>
    </form>
  );
}
