import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { useToast } from "@/components/ui/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";

export function UserMenu() {
  const { user, logout, isLoggingOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const items = [
    {
      label: user?.name || "Profile",
      icon: <User aria-hidden />,
      onClick: () => navigate("/settings"),
      disabled: true,
    },
    {
      label: "Settings",
      icon: <Settings aria-hidden />,
      onClick: () => navigate("/settings"),
    },
    { type: "separator" },
    {
      label: isLoggingOut ? "Signing out…" : "Sign out",
      icon: <LogOut aria-hidden />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Dropdown
      trigger={
        <button
          type="button"
          aria-label="Open user menu"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-transparent transition-colors hover:bg-surface-2 btn-focus"
        >
          <Avatar name={user?.name} size="sm" />
        </button>
      }
      items={items}
    />
  );
}