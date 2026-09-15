import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck, Rocket, CalendarClock, AlertOctagon, Sparkles } from "lucide-react";
import { useNotifications } from "@/features/notifications/useNotifications";
import { cn } from "@/lib/cn";
import { fromNow } from "@/utils/format";

const typeIcon = {
  deployment_failed: { icon: Rocket, tone: "text-danger" },
  deployment_success: { icon: Rocket, tone: "text-success" },
  task_due: { icon: CalendarClock, tone: "text-warning" },
  project_attention: { icon: AlertOctagon, tone: "text-warning" },
  ai_blocker: { icon: Sparkles, tone: "text-info" },
  system: { icon: Bell, tone: "text-ink-secondary" },
};

function NotificationBellButton({ onClick, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Notifications (${count} unread)`}
      className="relative flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-ink-secondary transition-colors hover:bg-surface-2 hover:text-ink btn-focus"
    >
      <Bell className="h-4 w-4" aria-hidden />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 font-mono text-[9px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead, markUnread, markAllRead, reconcile, isLoading } =
    useNotifications();

  useEffect(() => {
    if (!open) return;
    reconcile.mutate();
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSelect = (n) => {
    if (!n.isRead) markRead.mutate(n.id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div ref={rootRef} className="relative">
      <NotificationBellButton onClick={() => setOpen((v) => !v)} count={unreadCount} />

      {open && (
        <div className="absolute right-0 z-40 mt-1.5 w-[min(92vw,384px)] animate-scale-in overflow-hidden rounded-lg border border-edge bg-surface-2 shadow-lg">
          <div className="flex items-center justify-between border-b border-edge px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-ink">Notifications</h3>
              <p className="text-[11px] text-ink-muted">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="inline-flex items-center gap-1 rounded text-xs font-medium text-accent hover:text-accent-strong btn-focus"
              >
                <CheckCheck className="h-3.5 w-3.5" aria-hidden />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading && (
              <p className="px-4 py-8 text-center text-xs text-ink-muted">Loading notifications…</p>
            )}
            {!isLoading && notifications.length === 0 && (
              <p className="px-4 py-8 text-center text-xs text-ink-muted">Nothing here yet.</p>
            )}
            {!isLoading &&
              notifications.map((n) => {
                const meta = typeIcon[n.type] || typeIcon.system;
                const unread = !n.isRead;
                return (
                  <div
                    key={n.id}
                    className={cn(
                      "flex cursor-pointer gap-3 border-b border-edge/60 px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-3",
                      unread && "bg-surface/60",
                    )}
                    onClick={() => handleSelect(n)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSelect(n);
                    }}
                  >
                    <meta.icon className={cn("mt-0.5 h-4 w-4 shrink-0", meta.tone)} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-[13px] leading-snug", unread ? "font-medium text-ink" : "text-ink-secondary")}>
                          {n.title}
                        </p>
                        {unread && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-label="Unread" />}
                      </div>
                      {n.message && <p className="mt-0.5 text-xs text-ink-muted line-clamp-2">{n.message}</p>}
                      <p className="mt-1 text-[10px] text-ink-muted">{fromNow(n.createdAt)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        unread ? markUnread.mutate(n.id) : markRead.mutate(n.id);
                      }}
                      className="self-start rounded p-1 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink btn-focus"
                      aria-label={unread ? "Mark as read" : "Mark as unread"}
                      title={unread ? "Mark as read" : "Mark as unread"}
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}