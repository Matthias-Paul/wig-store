import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateDeliveryFee } from "../api/adminDeliveryFeesApi";

export function useUpdateDeliveryFee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      fee,
      isActive,
    }: {
      id: string;
      fee: number;
      isActive?: boolean;
    }) => updateDeliveryFee(id, { fee, isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-delivery-fees"] });
      toast.success("Delivery fee updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
