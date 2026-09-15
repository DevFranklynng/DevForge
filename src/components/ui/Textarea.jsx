import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Textarea = forwardRef(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full rounded-md border border-edge bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-ink-muted",
        "transition-colors focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20",
        "disabled:opacity-50 disabled:pointer-events-none resize-y min-h-[80px]",
        invalid && "border-danger/60 focus:border-danger/70 focus:ring-danger/20",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";