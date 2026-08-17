import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateOrderStatus } from "../api/adminOrdersApi";

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-order", id] });
      toast.success(`Order status successfully updated to ${status}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
