import { useId } from "react";
import { cn } from "@/lib/cn";

export function Field({ label, hint, error, htmlFor, required, className, children }) {
  const autoId = useId();
  const id = htmlFor || autoId;

  const resolved =
    typeof children === "function" ? children({ id, invalid: Boolean(error) }) : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-ink-secondary">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      {resolved}
      {error && <p className="text-xs text-danger">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}