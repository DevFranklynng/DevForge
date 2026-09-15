import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function Spinner({ className, label = "Loading" }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm text-ink-secondary">
      <Loader2 className={cn("h-4 w-4 animate-spin text-ink-muted", className)} aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function PageSpinner({ label }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status">
      <Spinner label={label || "Loading"} />
    </div>
  );
}