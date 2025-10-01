import { BellRing, Inbox, CalendarClock, X } from "lucide-react";

import type { ChatNotification, TeamMember } from "@/data/team-chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconByType: Record<ChatNotification["type"], typeof BellRing> = {
  mention: BellRing,
  reminder: Inbox,
  system: CalendarClock,
};

interface NotificationTrayProps {
  notifications: ChatNotification[];
  members: TeamMember[];
  onOpenConversation: (memberId: string | undefined) => void;
  onDismiss: (notificationId: string) => void;
}

export function NotificationTray({
  notifications,
  members,
  onOpenConversation,
  onDismiss,
}: NotificationTrayProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute right-6 top-6 flex w-80 flex-col gap-3">
      {notifications.map((notification) => {
        const Icon = iconByType[notification.type];
        const member = notification.memberId
          ? members.find((item) => item.id === notification.memberId)
          : undefined;

        return (
          <article
            key={notification.id}
            className={cn(
              "pointer-events-auto overflow-hidden rounded-3xl border border-amber-500/40 bg-white/95 shadow-[0_25px_45px_-30px_rgba(251,191,36,0.85)] backdrop-blur-lg transition hover:translate-y-[-2px] dark:bg-neutral-900/90",
            )}
          >
            <div className="flex items-start gap-3 px-5 py-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600">
                <Icon className="h-6 w-6" />
              </span>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {notification.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground/80">
                  <time dateTime={notification.createdAt}>
                    {new Intl.DateTimeFormat("en", {
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(new Date(notification.createdAt))}
                  </time>
                  {member && <span>· {member.name}</span>}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl text-muted-foreground hover:text-foreground"
                aria-label="Dismiss notification"
                onClick={() => onDismiss(notification.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 border-t border-dashed border-border/60 bg-amber-500/10 px-5 py-3">
              <Button
                size="sm"
                className="rounded-2xl bg-amber-500/90 text-white hover:bg-amber-500"
                onClick={() => onOpenConversation(notification.memberId)}
              >
                Jump into chat
              </Button>
              <span className="ml-auto text-xs font-medium uppercase tracking-wide text-amber-600">
                Live update
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
