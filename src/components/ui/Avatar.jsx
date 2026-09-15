import { cn } from "@/lib/cn";
import { initials } from "@/utils/format";

export function Avatar({ name, src, size = "md", className }) {
  const sizes = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-14 w-14 text-base",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={`${name}'s avatar`}
        className={cn("shrink-0 rounded-full object-cover ring-1 ring-edge", sizes[size], className)}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-surface-3 font-semibold text-ink-secondary ring-1 ring-edge",
        sizes[size],
        className,
      )}
    >
      {initials(name || "?")}
    </span>
  );
}