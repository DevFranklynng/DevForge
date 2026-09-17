import { Hammer } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

/**
 * Product wordmark: anvil mark in a black tile with a gold hammer and the
 * "DevForge" lockup. `size` selects the tile + type scale; `light` (a bool)
 * renders the tile variant used on dark surfaces. The ref `className` is
 * appended to the outer link/anchor-less wrapper.
 */
export function Logo({ size = "md", variant = "dark", className, to, onClick, compact }) {
  const tiles = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-9 w-9 rounded-xl",
    lg: "h-11 w-11 rounded-2xl",
    xl: "h-14 w-14 rounded-3xl",
  };
  const icons = {
    sm: "h-4 w-4",
    md: "h-[18px] w-[18px]",
    lg: "h-5 w-5",
    xl: "h-7 w-7",
  };
  const text = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-2xl",
  };

  const inner = (
    <>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center",
          tiles[size],
          variant === "dark"
            ? "border border-accent/30 bg-surface-2 shadow-[0_4px_20px_-6px_rgba(214,178,60,.35)]"
            : "border border-accent/40 bg-gradient-to-br from-black via-[#16130c] to-black shadow-[0_6px_24px_-8px_rgba(214,178,60,.45)]"
        )}
      >
        <Hammer className={cn(icons[size], "text-accent")} aria-hidden />
      </span>

      {!compact && (
        <span className={cn("leading-tight tracking-tight", text[size])}>
          <span className="font-bold text-ink">Dev</span>
          <span className="font-semibold text-accent">Forge</span>
        </span>
      )}
    </>
  );

  const classes = cn("inline-flex items-center gap-2 select-none", className);

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes} aria-label="DevForge home">
        {inner}
      </Link>
    );
  }
  return (
    <div className={classes} onClick={onClick} role={onClick ? "button" : undefined}>
      {inner}
    </div>
  );
}