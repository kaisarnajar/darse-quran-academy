"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-actions";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/notifications";

export async function openNotification(notificationId: string) {
  const session = await requireUser();
  const notification = await markNotificationRead(session.user.id, notificationId);

  if (notification?.href) {
    redirect(notification.href);
  }

  redirect("/profile/notifications");
}

export async function markAllNotificationsReadAction() {
  const session = await requireUser();
  await markAllNotificationsRead(session.user.id);
  revalidatePath("/profile/notifications");
  redirect("/profile/notifications");
}
