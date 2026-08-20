import { useQuery } from "@tanstack/react-query";
import { getAdminUsers, type AdminUsersQuery } from "../api/adminUsersApi";

export function useAdminUsers(params: AdminUsersQuery) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getAdminUsers(params),
    placeholderData: (prev) => prev,
  });
}
