"use client";

import { deleteCourseAnnouncement } from "@/app/teacher/courses/actions";
import { useState } from "react";

type DeleteAnnouncementButtonProps = {
  courseId: string;
  announcementId: string;
};

export function DeleteAnnouncementButton({ courseId, announcementId }: DeleteAnnouncementButtonProps) {
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
      <span className="text-xs text-muted">Delete this announcement?</span>
      <form action={deleteCourseAnnouncement.bind(null, courseId, announcementId)}>
        <button
          type="submit"
          className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
        >
          Yes, delete
        </button>
      </form>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-xs font-medium text-muted hover:underline"
      >
        Cancel
      </button>
    </div>
  );
}
