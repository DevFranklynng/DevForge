import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/cn";

const ToastContext = createContext({ push: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const tones = {
  success: "text-success border-l-success",
  error: "text-danger border-l-danger",
  info: "text-info border-l-info",
  warning: "text-warning border-l-warning",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, options = {}) => {
      const id = ++idRef.current;
      const variant = options.variant || "info";
      const title = options.title;
      setToasts((prev) => [...prev.slice(-4), { id, message, variant, title }]);
      const duration = options.duration ?? 4500;
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      push,
      success: (message, opts) => push(message, { ...opts, variant: "success" }),
      error: (message, opts) => push(message, { ...opts, variant: "error" }),
      info: (message, opts) => push(message, { ...opts, variant: "info" }),
      warning: (message, opts) => push(message, { ...opts, variant: "warning" }),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(92vw,360px)] flex-col gap-2" aria-live="polite" aria-atomic="false">
          {toasts.map((t) => {
            const Icon = icons[t.variant];
            return (
              <div
                key={t.id}
                role={t.variant === "error" ? "alert" : "status"}
                className={cn(
                  "pointer-events-auto flex items-start gap-3 rounded-md border border-edge bg-surface-2 px-3.5 py-3 shadow-md",
                  "animate-enter-from-top border-l-2",
                  tones[t.variant],
                )}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <div className="min-w-0 flex-1">
                  {t.title && <p className="text-sm font-semibold text-ink">{t.title}</p>}
                  <p className={cn("text-xs leading-relaxed", t.title ? "text-ink-secondary mt-0.5" : "text-ink")}>{t.message}</p>
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="text-ink-muted transition-colors hover:text-ink btn-focus"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            );
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}