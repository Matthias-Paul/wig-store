import { useQuery } from "@tanstack/react-query";
import { getAllNotificationsForAdmin } from "@/src/features/notifications/api/notificationsApi";

export function useAdminNotifications(page: number) {
  return useQuery({
    queryKey: ["admin-notifications", page],
    queryFn: () => getAllNotificationsForAdmin(page),
    placeholderData: (prev) => prev,
  });
}
