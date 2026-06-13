import type { SiteAnnouncement } from "@prisma/client";
import { DateDropdownFields } from "@/components/form/DateDropdownFields";
import { getFormDateParts, getFormDateYearOptions } from "@/lib/form-date";
import { inputClassName, labelClassName } from "@/lib/form";
import { HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX } from "@/lib/site-announcements";

type SiteAnnouncementFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  announcement?: SiteAnnouncement;
  featuredCount: number;
  error?: string;
};

export function SiteAnnouncementForm({
  action,
  submitLabel,
  announcement,
  featuredCount,
  error,
}: SiteAnnouncementFormProps) {
  const eventDateParts = getFormDateParts(announcement?.eventDate);
  const eventDateYears = getFormDateYearOptions(
    eventDateParts.year ? Number(eventDateParts.year) : undefined,
  );
  const isCurrentlyFeatured = announcement?.showOnHomepage ?? false;
  const featuredSlotsFull = featuredCount >= HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX;
  const canFeatureThisAnnouncement = isCurrentlyFeatured || !featuredSlotsFull;
  const displayedFeaturedCount = Math.min(featuredCount, HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX);

  return (
    <form action={action} className="mx-auto max-w-2xl space-y-5">
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
          defaultValue={announcement?.title ?? ""}
          placeholder="e.g. Guest Mufti visit — Masjid Al-Noor"
          className={inputClassName}
        />
      </div>

      <DateDropdownFields
        namePrefix="event"
        label="Event date (optional)"
        parts={eventDateParts}
        yearOptions={eventDateYears}
      />

      <div>
        <label htmlFor="location" className={labelClassName}>
          Location (optional)
        </label>
        <input
          id="location"
          name="location"
          maxLength={200}
          defaultValue={announcement?.location ?? ""}
          placeholder="e.g. Masjid Al-Noor, Srinagar"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="body" className={labelClassName}>
          Announcement
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={8}
          defaultValue={announcement?.body ?? ""}
          placeholder="Full details for students and visitors…"
          className={inputClassName}
        />
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-background/40 px-4 py-4">
        <label
          className={`flex items-start gap-3 text-sm text-foreground ${
            canFeatureThisAnnouncement ? "cursor-pointer" : ""
          }`}
        >
          <input
            type="checkbox"
            name="showOnHomepage"
            defaultChecked={isCurrentlyFeatured}
            disabled={!canFeatureThisAnnouncement}
            className="mt-1 rounded border-border disabled:cursor-not-allowed"
          />
          <span>
            <span className="font-medium">Show on homepage</span>
            {canFeatureThisAnnouncement ? (
              <span className="mt-0.5 block text-muted">
                Featured in the Featured Announcements section when published (up to{" "}
                {HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX}; {displayedFeaturedCount}/
                {HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX} slots used). All published announcements still
                appear on the Announcements page.
              </span>
            ) : (
              <span className="mt-0.5 block text-muted">
                There are already {HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX} featured announcements.
                Remove one announcement from the homepage to add this one as a featured announcement.
              </span>
            )}
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            name="published"
            defaultChecked={announcement?.published ?? true}
            className="mt-1 rounded border-border"
          />
          <span>
            <span className="font-medium">Published</span>
            <span className="mt-0.5 block text-muted">Uncheck to save as draft (hidden from the public site).</span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="min-h-11 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light sm:w-auto sm:px-8"
      >
        {submitLabel}
      </button>
    </form>
  );
}
