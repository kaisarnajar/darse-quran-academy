import type { StudentNotification } from "@prisma/client";
import { NotificationCard } from "@/components/profile/NotificationCard";

export function NotificationList({
  notifications,
  emptyMessage = "No notifications yet.",
}: {
  notifications: StudentNotification[];
  emptyMessage?: string;
}) {
  if (notifications.length === 0) {
    return (
      <div className="card-elevated flex flex-col items-center px-6 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-muted/60 text-muted">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
        </div>
        <p className="mt-4 font-serif text-base font-semibold text-foreground">All caught up</p>
        <p className="mt-1 max-w-sm text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </ul>
  );
}
