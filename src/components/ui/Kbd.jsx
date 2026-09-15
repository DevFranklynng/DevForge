import { cn } from "@/lib/cn";

export function Kbd({ children, className }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded border border-edge bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] font-medium text-ink-secondary",
        className,
      )}
    >
      {children}
    </kbd>
  );
}