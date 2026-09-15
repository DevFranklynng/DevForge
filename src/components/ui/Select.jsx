import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export const Select = forwardRef(function Select({ className, children, invalid, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-9 w-full appearance-none rounded-md border border-edge bg-surface-2 pl-3 pr-9 text-sm text-ink",
          "transition-colors focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20",
          "disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          invalid && "border-danger/60",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
    </div>
  );
});

Select.displayName = "Select";