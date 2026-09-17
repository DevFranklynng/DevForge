import { Inbox, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import { SkeletonRow } from "@/components/ui/Skeleton";

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-dashed border-edge px-6 py-12 text-center", className)}>
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 shadow-[0_12px_28px_-16px_rgba(214,178,60,0.5)]">
        {Icon ? <Icon className="h-5 w-5 text-accent" aria-hidden /> : <Inbox className="h-5 w-5 text-accent" aria-hidden />}
      </div>
      <h3 className="text-sm font-medium text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-xs text-ink-secondary">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading…", className }) {
  return (
    <div
      className={cn("flex flex-col gap-3 rounded-lg border border-edge bg-surface p-5", className)}
      role="status"
      aria-label={label}
    >
      <SkeletonRow lines={3} />
    </div>
  );
}

export function ErrorState({ message, onRetry, title = "Something went wrong" }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-danger/30 bg-danger/5 px-6 py-12 text-center" role="alert">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg border border-danger/30 bg-danger/10">
        <TriangleAlert className="h-5 w-5 text-danger" aria-hidden />
      </div>
      <h3 className="text-sm font-medium text-danger">{title}</h3>
      <p className="mt-1 max-w-sm break-words text-xs text-ink-secondary">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 text-xs font-medium text-accent hover:text-accent-strong focus-visible:outline-accent">
          Try again
        </button>
      )}
    </div>
  );
}