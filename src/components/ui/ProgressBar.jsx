import { cn } from "@/lib/cn";

export function ProgressBar({ value, max = 100, className, size = "sm" }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress ${Math.round(pct)}%`}
      className={cn(
        "w-full overflow-hidden rounded-full bg-surface-3",
        size === "sm" ? "h-1.5" : "h-2.5",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500",
          pct >= 100
            ? "bg-success"
            : pct >= 55
              ? "bg-accent"
              : pct >= 25
                ? "bg-warning"
                : "bg-ink-muted",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}