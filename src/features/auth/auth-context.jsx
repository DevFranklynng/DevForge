import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, settingsApi } from "@/services/api";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authenticated | unauthenticated

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const data = await authApi.me();
      return data.user;
    },
    retry: false,
    staleTime: 60_000,
    enabled: status !== "unauthenticated",
  });

  useEffect(() => {
    if (meQuery.isLoading) return;
    if (meQuery.data) {
      setUser(meQuery.data);
      setStatus("authenticated");
    } else if (meQuery.isError) {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, [meQuery.data, meQuery.isError, meQuery.isLoading]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      setUser(data.user);
      setStatus("authenticated");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      setUser(data.user);
      setStatus("authenticated");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: async () => {
      queryClient.clear();
      setUser(null);
      setStatus("unauthenticated");
    },
  });

  const updateUser = useCallback((next) => {
    const patched = next && user ? { ...user, ...next } : next;
    setUser(patched);
    if (patched) queryClient.setQueryData(["auth", "me"], patched);
  }, [user, queryClient]);

  const saveSettings = useCallback(
    async (patch) => {
      const { settings } = await settingsApi.update(patch);
      updateUser({ settings });
      return settings;
    },
    [updateUser],
  );

  const value = useMemo(
    () => ({
      user,
      status,
      login: loginMutation.mutateAsync,
      register: registerMutation.mutateAsync,
      logout: logoutMutation.mutateAsync,
      isLoggingOut: logoutMutation.isPending,
      updateUser,
      saveSettings,
    }),
    [user, status, loginMutation.mutateAsync, registerMutation.mutateAsync, logoutMutation.mutateAsync, logoutMutation.isPending, updateUser, saveSettings],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}