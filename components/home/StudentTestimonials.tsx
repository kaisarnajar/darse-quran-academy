import Link from "next/link";
import type { Session } from "next-auth";
import { SplitSectionTitle } from "@/components/site/SplitSectionTitle";
import { auth } from "@/lib/auth";
import type { HomepageReview } from "@/lib/student-reviews";
import { getFeaturedHomepageReviews } from "@/lib/student-reviews";

function getWriteReviewHref(session: Session | null) {
  if (session?.user?.id && session.user.role !== "TEACHER") {
    return "/profile/reviews";
  }
  return `/login?callbackUrl=${encodeURIComponent("/profile/reviews")}`;
}

function StarRating() {
  return (
    <div className="flex justify-center gap-0.5 text-gold" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ item }: { item: HomepageReview }) {
  return (
    <li>
      <article className="card-elevated flex h-full flex-col p-6 text-center sm:p-7">
        <StarRating />
        <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
          <span className="text-gold" aria-hidden>
            &ldquo;
          </span>
          {item.quote}
          <span className="text-gold" aria-hidden>
            &rdquo;
          </span>
        </blockquote>
        <footer className="mt-6 flex flex-col items-center border-t border-border pt-5">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-sm font-bold text-white"
            aria-hidden
          >
            {item.initials}
          </div>
          <cite className="mt-3 not-italic">
            <span className="block font-semibold text-foreground">{item.name}</span>
            <span className="mt-0.5 block text-xs text-muted">{item.location}</span>
            <span className="mt-1 block text-xs font-medium text-gold">{item.course}</span>
          </cite>
        </footer>
      </article>
    </li>
  );
}

export async function StudentTestimonials() {
  const [reviews, session] = await Promise.all([getFeaturedHomepageReviews(), auth()]);
  const writeReviewHref = getWriteReviewHref(session);

  return (
    <section className="pattern-islamic py-16 sm:py-20" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div id="testimonials-heading" className="text-center">
          <SplitSectionTitle
            muted="What our"
            accent="students say"
            className="[&_.title-muted]:text-foreground"
          />
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Hear from learners across Jammu &amp; Kashmir and beyond who study Quran, Tajweed, and Islamic
            sciences with us online.
          </p>
          <Link
            href={writeReviewHref}
            className="btn-gold-solid mt-6 inline-flex min-h-11 items-center justify-center px-8 py-3 text-sm font-semibold"
          >
            Write Review
          </Link>
        </div>

        {reviews.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {reviews.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-center text-sm text-muted">
            Be the first to share your experience — your review may appear here after admin approval.
          </p>
        )}
      </div>
    </section>
  );
}
