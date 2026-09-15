import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/services/api";

export function useNotifications() {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.list,
  });

  const unread = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: notificationsApi.unreadCount,
    refetchInterval: 60_000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const reconcile = useMutation({
    mutationFn: notificationsApi.reconcile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markRead = useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => invalidate(),
  });

  const markUnread = useMutation({
    mutationFn: notificationsApi.markUnread,
    onSuccess: () => invalidate(),
  });

  const markAllRead = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => invalidate(),
  });

  return {
    notifications: list.data?.notifications ?? [],
    isLoading: list.isLoading,
    isError: list.isError,
    error: list.error,
    unreadCount: unread.data?.count ?? 0,
    reconcile,
    markRead,
    markUnread,
    markAllRead,
    refetch: list.refetch,
  };
}

export function useNotificationCounter() {
  const { unreadCount } = useNotifications();
  return unreadCount;
}