import { cn } from "@/lib/cn";

export function Card({ className, hoverable, ...props }) {
  return (
    <div
      className={cn("rounded-lg border border-edge bg-surface", hoverable && "transition-colors hover:border-edge-strong", className)}
      {...props}
    />
  );
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn("flex items-start justify-between gap-3 border-b border-edge px-4 py-3.5", className)}>
      <div>
        {title && <h3 className="text-sm font-semibold text-ink">{title}</h3>}
        {subtitle && <p className="mt-0.5 text-xs text-ink-secondary">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("px-4 py-4", className)} {...props} />;
}