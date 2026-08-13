import { useQuery } from "@tanstack/react-query";
import { getMyNotifications } from "../api/notificationsApi";

export function useMyNotifications(page: number) {
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: () => getMyNotifications(page),
    placeholderData: (previousData) => previousData,
  });
}
