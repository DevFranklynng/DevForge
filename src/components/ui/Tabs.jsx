import { cn } from "@/lib/cn";

export function Tabs({ items, value, onChange, className, "aria-label": ariaLabel }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex items-center gap-1 overflow-x-auto border-b border-edge", className)}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative -mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition-colors btn-focus",
              active
                ? "border-accent text-ink font-medium"
                : "border-transparent text-ink-secondary hover:text-ink",
            )}
          >
            {item.icon}
            {item.label}
            {typeof item.count === "number" && item.count > 0 && (
              <span className="tabular rounded bg-surface-3 px-1.5 py-px text-[10px] font-medium text-ink-secondary">
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}