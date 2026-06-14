import type { StudentNotification } from "@prisma/client";
import {
  notificationTypeClass,
  notificationTypeLabel,
} from "@/lib/notifications";
import { openNotification } from "@/app/profile/notifications/actions";

function formatNotificationTime(date: Date): string {
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function NotificationItem({ notification }: { notification: StudentNotification }) {
  const unread = !notification.readAt;

  return (
    <li>
      <form action={openNotification.bind(null, notification.id)}>
        <button
          type="submit"
          className={`w-full rounded-lg border px-4 py-4 text-left transition-colors hover:bg-accent-muted/30 ${
            unread
              ? "border-primary/20 bg-violet-50/60"
              : "border-border bg-surface"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${notificationTypeClass(notification.type)}`}
                >
                  {notificationTypeLabel(notification.type)}
                </span>
                {unread && (
                  <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                )}
              </div>
              <p className="mt-2 font-medium text-foreground">{notification.title}</p>
              {notification.body && (
                <p className="mt-1 text-sm text-muted line-clamp-2">{notification.body}</p>
              )}
            </div>
            <time
              className="shrink-0 text-xs text-muted"
              dateTime={notification.createdAt.toISOString()}
            >
              {formatNotificationTime(notification.createdAt)}
            </time>
          </div>
        </button>
      </form>
    </li>
  );
}

export function NotificationList({
  notifications,
  emptyMessage = "No notifications yet.",
}: {
  notifications: StudentNotification[];
  emptyMessage?: string;
}) {
  if (notifications.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </ul>
  );
}
