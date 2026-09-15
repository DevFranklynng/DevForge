import { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { useAuth } from "@/features/auth/auth-context";
import { useHotkey } from "@/hooks/useHotkey";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function AppLayout() {
  const { status } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoverExpanded, setHoverExpanded] = useState(false);

  const collapsed = isTablet && !(isDesktop && hoverExpanded);

  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    setHoverExpanded(false);
  }, [location.pathname]);

  useHotkey("mod+k", () => setSearchOpen((v) => !v));

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const shell = useMemo(
    () => (
      <div className="flex min-h-screen bg-canvas text-ink">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onHoverChange={setHoverExpanded}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenuClick={() => setMobileOpen(true)} onOpenSearch={() => setSearchOpen(true)} />
          <main className="flex-1 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
        <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    ),
    [collapsed, mobileOpen, searchOpen, setHoverExpanded],
  );

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-ink-secondary">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return shell;
}