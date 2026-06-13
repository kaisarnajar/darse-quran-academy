"use client";

import { useFormStatus } from "react-dom";
import { toggleSiteAnnouncementHomepage } from "@/app/admin/announcements/actions";

type ToggleHomepageAnnouncementButtonProps = {
  id: string;
  showOnHomepage: boolean;
  published: boolean;
  canFeatureThisAnnouncement: boolean;
};

function SubmitLabel({ showOnHomepage }: { showOnHomepage: boolean }) {
  const { pending } = useFormStatus();
  if (pending) return "Updating…";
  return showOnHomepage ? "On homepage" : "Add to homepage";
}

export function ToggleHomepageAnnouncementButton({
  id,
  showOnHomepage,
  published,
  canFeatureThisAnnouncement,
}: ToggleHomepageAnnouncementButtonProps) {
  if (!published) {
    return <span className="text-xs text-muted">Publish first</span>;
  }

  if (!showOnHomepage && !canFeatureThisAnnouncement) {
    return <span className="text-xs text-muted">Slots full</span>;
  }

  return (
    <form action={toggleSiteAnnouncementHomepage.bind(null, id)}>
      <button
        type="submit"
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
          showOnHomepage
            ? "bg-violet-100 text-violet-900 hover:bg-violet-200"
            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
        }`}
        title={showOnHomepage ? "Remove from homepage" : "Feature on homepage"}
      >
        <SubmitLabel showOnHomepage={showOnHomepage} />
      </button>
    </form>
  );
}
