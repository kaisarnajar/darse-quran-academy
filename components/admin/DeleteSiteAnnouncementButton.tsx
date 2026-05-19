"use client";

import { deleteSiteAnnouncement } from "@/app/admin/announcements/actions";
import { useState } from "react";

export function DeleteSiteAnnouncementButton({ id, title }: { id: string; title: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm font-medium text-red-700 hover:underline"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted">Delete?</span>
      <form action={deleteSiteAnnouncement.bind(null, id)}>
        <button
          type="submit"
          className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
        >
          Yes
        </button>
      </form>
      <button type="button" onClick={() => setConfirming(false)} className="text-xs text-muted hover:underline">
        Cancel
      </button>
    </div>
  );
}
