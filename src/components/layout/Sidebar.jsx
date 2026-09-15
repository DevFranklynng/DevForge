import { NavLink } from "react-router-dom";
import {
  Activity,
  Braces,
  FolderKanban,
  Github,
  LayoutDashboard,
  ListChecks,
  Rocket,
  Settings,
  Sparkles,
  X,
  Hammer,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/features/auth/auth-context";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tasks", href: "/tasks", icon: ListChecks },
  { label: "Deployments", href: "/deployments", icon: Rocket },
  { label: "Repositories", href: "/github", icon: Github },
  { label: "APIs", href: "/apis", icon: Braces },
  { label: "Activity", href: "/activity", icon: Activity },
];

const footerNavigation = [
  { label: "DevForge AI", href: "/ai", icon: Sparkles, badge: "AI" },
  { label: "Settings", href: "/settings", icon: Settings },
];

function Logo({ collapsed }) {
  return (
    <div className="flex items-center gap-2.5 px-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-edge-strong bg-surface-2">
        <Hammer className="h-4 w-4 text-accent" aria-hidden />
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-ink">DevForge</p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">command center</p>
        </div>
      )}
    </div>
  );
}

function NavLinkItem({ item, collapsed, onNavigate }) {
  return (
    <NavLink
      to={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors btn-focus",
          "focus-visible:outline-2 focus-visible:outline-accent/70",
          isActive
            ? "bg-surface-2 text-ink font-medium border border-edge"
            : "text-ink-secondary hover:bg-surface-2/60 hover:text-ink border border-transparent",
          collapsed && "justify-center px-0",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent transition-opacity",
              isActive ? "opacity-100" : "opacity-0",
            )}
          />
          <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-accent" : "text-ink-muted group-hover:text-ink-secondary")} aria-hidden />
          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
          {item.badge && !collapsed && (
            <span className="rounded border border-accent/30 bg-accent/10 px-1 py-px font-mono text-[9px] font-semibold text-accent">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ collapsed, mobileOpen, onClose, onHoverChange }) {
  const { user } = useAuth();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        aria-label="Primary navigation"
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-edge bg-surface transition-[width,transform] duration-200 lg:static lg:translate-x-0 lg:bg-transparent",
          collapsed ? "md:w-20 md:items-stretch" : "lg:w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className={cn("flex h-14 items-center justify-between border-b border-edge px-3", collapsed && "md:justify-center")}>
          <Logo collapsed={collapsed} />
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-secondary lg:hidden btn-focus"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <nav
          className={cn("flex-1 space-y-1 overflow-y-auto p-3", collapsed && "md:px-2 md:space-y-2")}
          aria-label="Main menu"
        >
          {navigation.map((item) => (
            <NavLinkItem key={item.href} item={item} collapsed={collapsed} onNavigate={onClose} />
          ))}
        </nav>

        <div className={cn("space-y-1 border-t border-edge p-3", collapsed && "md:px-2")}>
          {footerNavigation.map((item) => (
            <NavLinkItem key={item.href} item={item} collapsed={collapsed} onNavigate={onClose} />
          ))}
          {!collapsed && (
            <div className="mt-3 rounded-md border border-edge bg-surface-2 p-3">
              <p className="truncate text-xs font-medium text-ink">{user?.name}</p>
              <p className="truncate font-mono text-[10px] text-ink-muted">{user?.email}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}