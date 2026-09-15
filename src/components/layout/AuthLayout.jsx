import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Hammer } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";

export function AuthLayout() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-ink-secondary">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <header className="flex h-14 items-center gap-2.5 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-edge-strong bg-surface-2">
          <Hammer className="h-4 w-4 text-accent" aria-hidden />
        </div>
        <p className="text-sm font-semibold tracking-tight">DevForge</p>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <Outlet />
      </main>

      <footer className="px-6 py-4 text-center text-[11px] text-ink-muted">
        Simplifying software delivery — one screen at a time.
      </footer>
    </div>
  );
}

