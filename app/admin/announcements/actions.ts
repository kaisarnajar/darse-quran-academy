"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-actions";
import { formatInputDateValue } from "@/lib/form-date";
import { prisma } from "@/lib/prisma";
import { enforceHomepageAnnouncementLimit, resolveAnnouncementFeaturedUpdate } from "@/lib/site-announcements";
import { siteAnnouncementSchema } from "@/lib/validations";

function adminListPath(query = "") {
  return `/admin/announcements${query}`;
}

function parseSiteAnnouncementForm(formData: FormData) {
  const published = formData.get("published") === "on";
  const showOnHomepage = formData.get("showOnHomepage") === "on";

  if (showOnHomepage && !published) {
    return {
      ok: false as const,
      message: "Only published announcements can appear on the homepage.",
    };
  }

  const eventDateInput = String(formData.get("eventDate") ?? "").trim();
  const eventDate = eventDateInput ? formatInputDateValue(eventDateInput) ?? "" : "";
  if (eventDateInput && !eventDate) {
    return {
      ok: false as const,
      message: "Enter a valid event date or leave the field blank.",
    };
  }

  const parsed = siteAnnouncementSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    eventDate,
    location: formData.get("location") ?? "",
    showOnHomepage,
    published,
  });

  if (!parsed.success) {
    return {
      ok: false as const,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  return { ok: true as const, data: parsed.data };
}

export async function createSiteAnnouncement(formData: FormData) {
  const session = await requireAdmin();
  const parsed = parseSiteAnnouncementForm(formData);

  if (!parsed.ok) {
    redirect(`${adminListPath("/new")}?error=${encodeURIComponent(parsed.message)}`);
  }

  const featured = await resolveAnnouncementFeaturedUpdate({
    published: parsed.data.published,
    requestFeatured: parsed.data.showOnHomepage,
    currentlyFeatured: false,
  });

  if ("error" in featured) {
    redirect(`${adminListPath("/new")}?error=${encodeURIComponent(featured.error)}`);
  }

  await prisma.siteAnnouncement.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      eventDate: parsed.data.eventDate || null,
      location: parsed.data.location || null,
      showOnHomepage: featured.showOnHomepage,
      published: parsed.data.published,
      createdById: session.user.id,
    },
  });

  revalidateSiteAnnouncementPaths();
  redirect(`${adminListPath()}?posted=1`);
}

export async function updateSiteAnnouncement(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseSiteAnnouncementForm(formData);

  if (!parsed.ok) {
    redirect(`${adminListPath(`/${id}/edit`)}?error=${encodeURIComponent(parsed.message)}`);
  }

  const existing = await prisma.siteAnnouncement.findUnique({ where: { id } });
  if (!existing) {
    redirect(`${adminListPath()}?error=notfound`);
  }

  const featured = await resolveAnnouncementFeaturedUpdate({
    published: parsed.data.published,
    requestFeatured: parsed.data.showOnHomepage,
    currentlyFeatured: existing.showOnHomepage,
  });

  if ("error" in featured) {
    redirect(`${adminListPath(`/${id}/edit`)}?error=${encodeURIComponent(featured.error)}`);
  }

  await prisma.siteAnnouncement.update({
    where: { id },
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      eventDate: parsed.data.eventDate || null,
      location: parsed.data.location || null,
      showOnHomepage: featured.showOnHomepage,
      published: parsed.data.published,
    },
  });

  revalidateSiteAnnouncementPaths();
  redirect(`${adminListPath()}?saved=1`);
}

export async function toggleSiteAnnouncementHomepage(id: string) {
  await requireAdmin();

  const existing = await prisma.siteAnnouncement.findUnique({ where: { id } });
  if (!existing) {
    redirect(`${adminListPath()}?error=notfound`);
  }

  if (!existing.published) {
    redirect(
      `${adminListPath()}?error=${encodeURIComponent("Publish the announcement before featuring it on the homepage.")}`,
    );
  }

  const showOnHomepage = !existing.showOnHomepage;

  await prisma.siteAnnouncement.update({
    where: { id },
    data: { showOnHomepage },
  });

  if (showOnHomepage) {
    await enforceHomepageAnnouncementLimit();
  }

  revalidateSiteAnnouncementPaths();
  redirect(`${adminListPath()}?saved=1`);
}

export async function deleteSiteAnnouncement(id: string) {
  await requireAdmin();

  const existing = await prisma.siteAnnouncement.findUnique({ where: { id } });
  if (!existing) {
    redirect(`${adminListPath()}?error=notfound`);
  }

  await prisma.siteAnnouncement.delete({ where: { id } });

  revalidateSiteAnnouncementPaths();
  redirect(`${adminListPath()}?deleted=1`);
}

function revalidateSiteAnnouncementPaths() {
  revalidatePath("/");
  revalidatePath("/announcements");
  revalidatePath("/admin/announcements");
}
