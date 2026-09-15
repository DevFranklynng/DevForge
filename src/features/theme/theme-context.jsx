import { createContext, useContext, useEffect, useMemo } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { useToast } from "@/components/ui/Toast";

const ThemeContext = createContext(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }) {
  const { user, saveSettings } = useAuth();
  const toast = useToast();

  const theme = user?.settings?.theme || "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  const setTheme = async (next) => {
    if (next === theme) return;
    try {
      await saveSettings({ theme: next });
    } catch {
      toast.error("Could not update theme");
    }
  };

  const value = useMemo(
    () => ({ theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}