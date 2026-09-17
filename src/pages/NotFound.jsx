import { Link } from "react-router-dom";
import { Hammer } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center text-ink">
      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-edge-strong bg-surface-2">
        <Hammer className="h-5 w-5 text-accent" aria-hidden />
      </div>
      <p className="mt-5 font-mono text-5xl font-semibold text-ink-secondary">404</p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-1 max-w-sm text-sm text-ink-secondary">
        The page you’re looking for was moved, deleted, or never existed.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex h-9 items-center rounded-md bg-accent-strong px-4 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent/90"
      >
        Back to dashboard
      </Link>
    </div>
  );
}