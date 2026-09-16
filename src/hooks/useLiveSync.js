import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/features/auth/auth-context";

// Resource event -> query-key prefixes + cross-cutting caches to refresh.
// Invalidating with a prefix refreshes every query whose key starts with it.
const IMPACT = {
  tasks: ["tasks", "dashboard", "projects", "notifications", "activity"],
  projects: ["projects", "dashboard", "activity", "notifications"],
  deployments: ["deployments", "dashboard", "activity", "notifications"],
  repositories: ["repositories", "dashboard", "projects", "githubStatus"],
  apis: ["apis", "dashboard", "projects"],
  activity: ["activity", "dashboard"],
  notifications: ["notifications"],
  settings: ["settings", "auth"],
};

/**
 * Keeps the UI in sync across tabs/windows without a manual refresh. Opens a
 * Server-Sent Events stream to /api/events and, on each resource event,
 * invalidates the affected TanStack Query caches so every open view updates
 * in place the moment the server state changes.
 */
export function useLiveSync() {
  const queryClient = useQueryClient();
  const { status } = useAuth();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (typeof EventSource === "undefined") return;

    const source = new EventSource(`${api.baseUrl}/api/events`, {
      withCredentials: true,
    });

    const handler = (event) => {
      const resource = event.type;
      const keys = IMPACT[resource];
      if (!keys) return;
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    };

    Object.keys(IMPACT).forEach((resource) => source.addEventListener(resource, handler, false));

    source.onerror = () => {
      // EventSource reconnects automatically; stop early when the session is gone.
      if (status === "unauthenticated") source.close();
    };

    return () => source.close();
  }, [status, queryClient]);
}