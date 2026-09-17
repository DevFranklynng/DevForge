import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User, Palette, Shield, Monitor, LayoutDashboard, Rows3, Moon, Sun, Laptop } from "lucide-react";
import { authApi, notificationsApi } from "@/services/api";
import { useAuth } from "@/features/auth/auth-context";
import { useTheme } from "@/features/theme/theme-context";
import { useToast } from "@/components/ui/Toast";
import { Tabs } from "@/components/ui/Tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/utils/format";

const themeIcon = { dark: Moon, light: Sun };
const viewIcon = { board: LayoutDashboard, list: Rows3 };

function optionButton({ active, onClick, icon: Icon, label, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-1.5 rounded-md border px-3 py-3 text-center transition-colors btn-focus",
        active ? "border-accent/60 bg-accent/10 text-ink" : "border-edge bg-surface-2 text-ink-secondary hover:border-edge-strong",
      )}
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden />}
      <span className="text-xs font-medium">{label}</span>
      {sub && <span className="text-[10px] text-ink-muted">{sub}</span>}
    </button>
  );
}

export default Settings;
export function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "profile";
  const { user, updateUser, saveSettings } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "", avatarUrl: user?.avatarUrl || "" });
  const [workspaceName, setWorkspaceName] = useState(user?.settings?.workspaceName || "");
  const [defaultView, setDefaultView] = useState(user?.settings?.defaultProjectView || "board");
  const [notifyDue, setNotifyDue] = useState(user?.settings?.notifyDueSoon ?? true);
  const [notifyFailing, setNotifyFailing] = useState(user?.settings?.notifyFailing ?? true);

  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ["sessions"],
    queryFn: authApi.sessions,
    enabled: tab === "security",
  });

  const profileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (res) => {
      updateUser(res.user);
      toast.success("Profile updated");
    },
    onError: (err) => toast.error(err.details?.message || err.message || "Failed to update profile"),
  });

  const settingsMutation = useMutation({
    mutationFn: (patch) => saveSettings(patch),
    onSuccess: () => toast.success("Preferences saved"),
    onError: (err) => toast.error(err.details?.message || err.message || "Failed to save preferences"),
  });

  const passwordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
      setPwError("");
      toast.success("Password changed — other sessions signed out");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: authApi.revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session revoked");
    },
    onError: (err) => toast.error(err.message || "Failed to revoke session"),
  });

  const markAllRead = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });

  const onTabChange = (value) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", value);
    setSearchParams(next);
  };

  const tabItems = useMemo(
    () => [
      { value: "profile", label: "Profile", icon: <User className="h-4 w-4" aria-hidden /> },
      { value: "preferences", label: "Preferences", icon: <Palette className="h-4 w-4" aria-hidden /> },
      { value: "security", label: "Security", icon: <Shield className="h-4 w-4" aria-hidden /> },
    ],
    [],
  );

  const submitProfile = (e) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    profileMutation.mutate({
      name: profile.name.trim(),
      email: profile.email.trim(),
      avatarUrl: profile.avatarUrl.trim() || null,
    });
  };

  const submitSettings = (e) => {
    e.preventDefault();
    settingsMutation.mutate({
      workspaceName: workspaceName.trim() || undefined,
      defaultProjectView: defaultView,
      notifyDueSoon: notifyDue,
      notifyFailing: notifyFailing,
    });
  };

  const submitPassword = (e) => {
    e.preventDefault();
    setPwError("");
    if (pw.newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pw.newPassword !== pw.confirm) {
      setPwError("New passwords do not match.");
      return;
    }
    passwordMutation.mutate({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-0.5 text-xs text-ink-muted">Your workspace, your way.</p>
      </div>

      <div className="mt-5">
        <Tabs items={tabItems} value={tab} onChange={onTabChange} aria-label="Settings sections" />
      </div>

      <div className="mt-5 pb-16">
        {tab === "profile" && (
          <form onSubmit={submitProfile} className="grid max-w-xl gap-4">
            <Card>
              <CardHeader title="Profile" subtitle="How you appear across your workspace." />
              <CardContent className="space-y-4">
                <Field label="Full name" htmlFor="s-name">
                  <Input id="s-name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </Field>
                <Field label="Email" htmlFor="s-email">
                  <Input id="s-email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </Field>
                <Field label="Avatar URL" htmlFor="s-avatar" hint="A public image URL is used as your avatar.">
                  <Input id="s-avatar" value={profile.avatarUrl} onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })} placeholder="https://…" />
                </Field>
              </CardContent>
              <div className="flex justify-end border-t border-edge px-4 py-3">
                <Button type="submit" variant="primary" loading={profileMutation.isPending}>
                  Save profile
                </Button>
              </div>
            </Card>
          </form>
        )}

        {tab === "preferences" && (
          <div className="grid max-w-xl gap-4">
            <Card>
              <CardHeader title="Appearance" subtitle="Theme is saved to your account." />
              <CardContent>
                <div className="flex gap-2">
                  {["dark", "light"].map((t) => {
                    const Icon = themeIcon[t];
                    return optionButton({
                      active: theme === t,
                      onClick: () => setTheme(t),
                      icon: Icon,
                      label: t === "dark" ? "Dark" : "Light",
                    });
                  })}
                </div>
              </CardContent>
            </Card>

            <form onSubmit={submitSettings}>
              <Card>
                <CardHeader title="Workspace" subtitle="Defaults applied when you open DevForge." />
                <CardContent className="space-y-4">
                  <Field label="Workspace name" htmlFor="s-workspace">
                    <Input id="s-workspace" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} placeholder="My workspace" />
                  </Field>

                  <div>
                    <p className="mb-1.5 text-xs font-medium text-ink-secondary">Default task view</p>
                    <div className="flex gap-2">
                      {["board", "list"].map((v) => {
                        const Icon = viewIcon[v];
                        return optionButton({
                          active: defaultView === v,
                          onClick: () => setDefaultView(v),
                          icon: Icon,
                          label: v === "board" ? "Board" : "List",
                        });
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 rounded-md border border-edge bg-surface-2 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-ink">Due-soon reminders</p>
                        <p className="text-[11px] text-ink-muted">Reconcile notifies you about tasks due in 48h.</p>
                      </div>
                      <Switch checked={notifyDue} onChange={setNotifyDue} aria-label="Due-soon reminders" />
                    </div>
                    <div className="border-t border-edge/60 pt-2 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-ink">Failing deployments</p>
                        <p className="text-[11px] text-ink-muted">Surface production failures in notifications.</p>
                      </div>
                      <Switch checked={notifyFailing} onChange={setNotifyFailing} aria-label="Failing deployment alerts" />
                    </div>
                  </div>
                </CardContent>
                <div className="flex justify-end border-t border-edge px-4 py-3">
                  <Button type="submit" variant="primary" loading={settingsMutation.isPending}>
                    Save preferences
                  </Button>
                </div>
              </Card>
            </form>

            <Card>
              <CardHeader title="Notifications" subtitle="Current mix of alert sources." />
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-ink-secondary">Mark every notification as read across your workspace.</p>
                <Button variant="outline" onClick={() => markAllRead.mutate()} loading={markAllRead.isPending}>
                  Mark all as read
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "security" && (
          <div className="grid max-w-xl gap-4">
            <form onSubmit={submitPassword}>
              <Card>
                <CardHeader title="Change password" subtitle="Signs out your other sessions when it changes." />
                <CardContent className="space-y-4">
                  <Field label="Current password" htmlFor="s-current">
                    <Input id="s-current" type="password" autoComplete="current-password" required value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="New password" htmlFor="s-new">
                      <Input id="s-new" type="password" autoComplete="new-password" required value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
                    </Field>
                    <Field label="Confirm new password" htmlFor="s-confirm">
                      <Input id="s-confirm" type="password" autoComplete="new-password" required value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
                    </Field>
                  </div>
                  {pwError && <p role="alert" className="text-xs text-danger">{pwError}</p>}
                  {passwordMutation.isError && (
                    <p role="alert" className="text-xs text-danger">{passwordMutation.error?.message}</p>
                  )}
                </CardContent>
                <div className="flex justify-end border-t border-edge px-4 py-3">
                  <Button type="submit" variant="primary" loading={passwordMutation.isPending}>
                    Update password
                  </Button>
                </div>
              </Card>
            </form>

            <Card>
              <CardHeader title="Active sessions" subtitle="Sessions trusted to sign in with your password hash." />
              <CardContent>
                {sessionsQuery.isLoading && <p className="text-xs text-ink-muted">Loading sessions…</p>}
                <ul className="divide-y divide-edge/60">
                  {(sessionsQuery.data?.sessions || []).map((s) => (
                    <li key={s.id} className="flex items-center gap-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm text-ink">{s.userAgent ? `Session · ${s.userAgent.slice(0, 48)}` : "Session"}</p>
                          {s.current && (
                            <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-px text-[10px] font-medium text-accent">This device</span>
                          )}
                        </div>
                        <p className="text-[11px] text-ink-muted">Signed in {formatDateTime(s.createdAt)} · expires {formatDateTime(s.expiresAt)}</p>
                      </div>
                      {!s.current && (
                        <Button size="sm" variant="danger" onClick={() => revokeMutation.mutate(s.id)} loading={revokeMutation.isPending}>
                          Revoke
                        </Button>
                      )}
                    </li>
                  ))}
                  {(sessionsQuery.data?.sessions || []).length === 0 && !sessionsQuery.isLoading && (
                    <p className="py-3 text-center text-xs text-ink-muted">No sessions found.</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}