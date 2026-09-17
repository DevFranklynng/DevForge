import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-canvas text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[480px] max-w-3xl bg-[radial-gradient(ellipse_at_top,rgba(214,178,60,0.14),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[300px] max-w-2xl bg-[radial-gradient(ellipse_at_bottom,rgba(214,178,60,0.07),transparent_60%)]"
      />

      <header className="relative flex h-14 items-center px-5 sm:px-8">
        <Logo to="/" size="sm" />
      </header>

      <main className="relative flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </main>

      <footer className="relative px-6 py-5 text-center text-[11px] text-ink-muted">
        Simplifying software delivery — one screen at a time.
      </footer>
    </div>
  );
}