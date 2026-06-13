"use client";

import type { SiteAnnouncement } from "@prisma/client";
import { useCallback } from "react";
import { DateDropdownFields } from "@/components/form/DateDropdownFields";
import {
  type SiteAnnouncementFormValues,
  validateSiteAnnouncementForm,
} from "@/lib/admin-form-validation";
import { getFormDateParts, getFormDateYearOptions } from "@/lib/form-date";
import { labelClassName } from "@/lib/form";
import { formErrorTextClassName, formFieldInputClass } from "@/lib/form-validation";
import { HOMEPAGE_FEATURED_ANNOUNCEMENTS_MAX } from "@/lib/site-announcements";
import { useZodForm } from "@/lib/use-zod-form";

type SiteAnnouncementFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  announcement?: SiteAnnouncement;
  featuredCount: number;
  error?: string;
};

const ANNOUNCEMENT_FIELDS: (keyof SiteAnnouncementFormValues)[] = [
  "title",
  "body",
  "location",
  "eventDay",
  "eventMonth",
  "eventYear",
  "showOnHomepage",
];

function dateFieldIssuePath(field: keyof SiteAnnouncementFormValues) {
  if (field === "eventDay" || field === "eventMonth" || field === "eventYear") {
    return "eventDate";
  }
  return field;
}

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

  const validate = useCallback(
    (values: SiteAnnouncementFormValues) => validateSiteAnnouncementForm(values),
    [],
  );

  const { values, updateField, markTouched, showError, errors, isValid } = useZodForm({
    initialValues: {
      title: announcement?.title ?? "",
      body: announcement?.body ?? "",
      location: announcement?.location ?? "",
      eventDay: eventDateParts.day,
      eventMonth: eventDateParts.month,
      eventYear: eventDateParts.year,
      showOnHomepage: announcement?.showOnHomepage ?? false,
      published: announcement?.published ?? true,
    },
    fields: ANNOUNCEMENT_FIELDS,
    validate,
    issuePathForField: dateFieldIssuePath,
  });

  const eventDateError = showError("eventDay") ? errors.eventDay : undefined;

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
          value={values.title}
          onChange={(e) => updateField("title", e.target.value)}
          onBlur={() => markTouched("title")}
          aria-invalid={showError("title") || undefined}
          placeholder="e.g. Guest Mufti visit — Masjid Al-Noor"
          className={formFieldInputClass(showError("title"))}
        />
        {showError("title") && (
          <p className={formErrorTextClassName} role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <DateDropdownFields
        namePrefix="event"
        label="Event date (optional)"
        parts={{
          day: values.eventDay,
          month: values.eventMonth,
          year: values.eventYear,
        }}
        yearOptions={eventDateYears}
        onPartsChange={(parts) => {
          updateField("eventDay", parts.day);
          updateField("eventMonth", parts.month);
          updateField("eventYear", parts.year);
        }}
        onBlur={() => {
          markTouched("eventDay");
          markTouched("eventMonth");
          markTouched("eventYear");
        }}
        hasError={Boolean(eventDateError)}
        errorMessage={eventDateError}
        errorId="event-date-error"
      />

      <div>
        <label htmlFor="location" className={labelClassName}>
          Location (optional)
        </label>
        <input
          id="location"
          name="location"
          maxLength={200}
          value={values.location}
          onChange={(e) => updateField("location", e.target.value)}
          onBlur={() => markTouched("location")}
          aria-invalid={showError("location") || undefined}
          placeholder="e.g. Masjid Al-Noor, Srinagar"
          className={formFieldInputClass(showError("location"))}
        />
        {showError("location") && (
          <p className={formErrorTextClassName} role="alert">
            {errors.location}
          </p>
        )}
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
          value={values.body}
          onChange={(e) => updateField("body", e.target.value)}
          onBlur={() => markTouched("body")}
          aria-invalid={showError("body") || undefined}
          placeholder="Full details for students and visitors…"
          className={formFieldInputClass(showError("body"))}
        />
        {showError("body") && (
          <p className={formErrorTextClassName} role="alert">
            {errors.body}
          </p>
        )}
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
            checked={values.showOnHomepage}
            disabled={!canFeatureThisAnnouncement}
            onChange={(e) => updateField("showOnHomepage", e.target.checked)}
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
        {showError("showOnHomepage") && (
          <p className={formErrorTextClassName} role="alert">
            {errors.showOnHomepage}
          </p>
        )}
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            name="published"
            checked={values.published}
            onChange={(e) => updateField("published", e.target.checked)}
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
        disabled={!isValid}
        className="min-h-11 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {submitLabel}
      </button>
    </form>
  );
}
