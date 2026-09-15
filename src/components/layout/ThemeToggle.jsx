import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/features/theme/theme-context";

export function ThemeToggle({ className }) {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
      title={`Switch to ${isLight ? "dark" : "light"} theme`}
      className={`flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-ink-secondary transition-colors hover:bg-surface-2 hover:text-ink btn-focus ${className || ""}`}
    >
      {isLight ? <Moon className="h-4 w-4" aria-hidden /> : <Sun className="h-4 w-4" aria-hidden />}
    </button>
  );
}