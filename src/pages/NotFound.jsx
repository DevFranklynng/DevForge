import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default NotFound;
export function NotFound() {
  useDocumentTitle("Page not found");
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-4 text-center text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[420px] max-w-2xl bg-[radial-gradient(ellipse_at_top,rgba(214,178,60,0.12),transparent_65%)]"
      />

      <div className="relative flex flex-col items-center">
        <Logo size="xl" />
        <p className="mt-8 bg-gradient-to-r from-accent via-[#f2d878] to-accent bg-clip-text font-mono text-6xl font-bold text-transparent sm:text-7xl">
          404
        </p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-1 max-w-sm text-sm text-ink-secondary">
          The page you’re looking for was moved, deleted, or never forged.
        </p>
        <Link
          to="/dashboard"
          className="mt-7 inline-flex h-10 items-center gap-2 rounded-md bg-accent-strong px-5 text-sm font-medium text-accent-contrast transition-all hover:bg-accent/90 hover:shadow-[0_10px_30px_-12px_rgba(214,178,60,0.55)] btn-focus"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}