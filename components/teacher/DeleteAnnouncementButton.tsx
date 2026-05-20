"use client";

import {
  deleteCourseAnnouncement,
  deleteStudentCourseAnnouncement,
} from "@/app/teacher/courses/actions";
import { useState } from "react";

type DeleteAnnouncementButtonProps = {
  courseId: string;
  announcementId: string;
  enrollmentId?: string;
  deleteAction?: (courseId: string, announcementId: string) => Promise<void>;
};

export function DeleteAnnouncementButton({
  courseId,
  announcementId,
  enrollmentId,
  deleteAction,
}: DeleteAnnouncementButtonProps) {
  const [confirming, setConfirming] = useState(false);

  const submitAction = deleteAction
    ? deleteAction.bind(null, courseId, announcementId)
    : enrollmentId
      ? deleteStudentCourseAnnouncement.bind(null, courseId, enrollmentId, announcementId)
      : deleteCourseAnnouncement.bind(null, courseId, announcementId);

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
      <form action={submitAction}>
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
