import { Inbox } from "lucide-react";
import { cn } from "@/lib/cn";

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-dashed border-edge px-6 py-12 text-center", className)}>
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg border border-edge bg-surface-2">
        {Icon ? <Icon className="h-5 w-5 text-ink-muted" aria-hidden /> : <Inbox className="h-5 w-5 text-ink-muted" aria-hidden />}
      </div>
      <h3 className="text-sm font-medium text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-xs text-ink-secondary">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-edge bg-surface px-6 py-12">
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry, title = "Something went wrong" }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-danger/30 bg-danger/5 px-6 py-12 text-center" role="alert">
      <div className="mb-3 h-11 w-11 rounded-lg border border-danger/30 bg-danger/10" />
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