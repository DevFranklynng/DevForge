import { useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { NotificationsPanel } from "./NotificationsPanel";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { Kbd } from "@/components/ui/Kbd";
import { resolvePageTitle } from "@/lib/page-titles";

export function Topbar({ onMenuClick, onOpenSearch }) {
  const location = useLocation();
  const title = resolvePageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-edge bg-surface/85 px-4 backdrop-blur-sm">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-ink-secondary transition-colors hover:bg-surface-2 hover:text-ink lg:hidden btn-focus"
      >
        <Menu className="h-4 w-4" aria-hidden />
      </button>

      <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{title}</p>

      <button
        type="button"
        onClick={onOpenSearch}
        aria-label="Open search"
        className="hidden items-center gap-2 rounded-md border border-edge bg-surface-2 px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-edge-strong hover:text-ink-secondary md:flex btn-focus"
      >
        <Search className="h-3.5 w-3.5" aria-hidden />
        Search…
        <Kbd>Ctrl K</Kbd>
      </button>

      <button
        type="button"
        onClick={onOpenSearch}
        aria-label="Open search"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-ink-secondary transition-colors hover:bg-surface-2 hover:text-ink md:hidden btn-focus"
      >
        <Search className="h-4 w-4" aria-hidden />
      </button>

      <ThemeToggle />
      <NotificationsPanel />
      <UserMenu />
    </header>
  );
}