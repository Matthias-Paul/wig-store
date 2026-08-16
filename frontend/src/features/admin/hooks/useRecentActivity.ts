import { useQuery } from "@tanstack/react-query";
import { getRecentActivity } from "../api/adminApi";

export function useRecentActivity() {
  return useQuery({
    queryKey: ["admin-recent-activity"],
    queryFn: getRecentActivity,
  });
}
