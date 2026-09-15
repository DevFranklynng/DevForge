import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-9 w-full rounded-md border border-edge bg-surface-2 px-3 text-sm text-ink placeholder:text-ink-muted",
        "transition-colors focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20",
        "disabled:opacity-50 disabled:pointer-events-none",
        invalid && "border-danger/60 focus:border-danger/70 focus:ring-danger/20",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";