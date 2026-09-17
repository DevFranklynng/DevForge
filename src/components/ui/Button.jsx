import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-accent-strong text-accent-contrast border border-accent-strong hover:bg-accent-strong/85 hover:border-accent focus-visible:outline-accent disabled:hover:bg-accent-strong",
  secondary: "bg-surface-2 text-ink border border-edge hover:border-edge-strong hover:bg-surface-3",
  ghost: "bg-transparent text-ink-secondary border border-transparent hover:text-ink hover:bg-surface-2",
  outline: "bg-transparent text-ink border border-edge-strong hover:border-accent/60 hover:text-ink",
  danger: "bg-transparent text-danger border border-danger/40 hover:bg-danger/10 hover:border-danger/60",
};

const sizes = {
  sm: "h-8 px-2.5 text-xs gap-1.5",
  md: "h-9 px-3.5 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
  icon: "h-9 w-9 justify-center",
};

export const Button = forwardRef(function Button(
  { className, variant = "secondary", size = "md", loading, full, leftIcon, rightIcon, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors select-none",
        "disabled:pointer-events-none disabled:opacity-50 btn-focus",
        full && "w-full",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

Button.displayName = "Button";