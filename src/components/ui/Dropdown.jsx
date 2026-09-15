import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function Dropdown({ trigger, items, align = "right", width = "w-56" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-40 mt-1.5 overflow-hidden rounded-md border border-edge bg-surface-2 py-1 shadow-lg animate-scale-in",
            align === "right" ? "right-0" : "left-0",
            width,
          )}
        >
          {items.map((item, i) => {
            if (item.type === "separator") {
              return <div key={`sep-${i}`} className="my-1 border-t border-edge" />;
            }
            const disabled = item.disabled;
            return (
              <button
                key={item.label}
                role="menuitem"
                disabled={disabled}
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors btn-focus",
                  item.danger
                    ? "text-danger hover:bg-danger/10"
                    : "text-ink-secondary hover:bg-surface-3 hover:text-ink",
                  disabled && "pointer-events-none opacity-40",
                )}
              >
                {item.icon && <span className="[&>svg]:h-4 [&>svg]:w-4">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
                {item.checked && <span className="text-accent">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}