import { Card } from "./Card";
import { cn } from "@/lib/cn";

export function StatCard({ label, value, sub, icon: Icon, accent, loading }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-ink-secondary">{label}</p>
          <p className={cn("tabular mt-1.5 text-2xl font-semibold text-ink", loading && "opacity-40")}>
            {loading ? "—" : value}
          </p>
          {sub && <p className="mt-1 text-xs text-ink-muted">{sub}</p>}
        </div>
        {Icon && (
          <div className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border",
            accent === "success" && "border-success/25 bg-success/10 text-success",
            accent === "warning" && "border-warning/25 bg-warning/10 text-warning",
            accent === "danger" && "border-danger/25 bg-danger/10 text-danger",
            accent === "info" && "border-info/25 bg-info/10 text-info",
            !accent && "border-edge bg-surface-2 text-ink-secondary",
          )}>
            <Icon className="h-4 w-4" aria-hidden />
          </div>
        )}
      </div>
    </Card>
  );
}