import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCartItem } from "../api/cartApi";

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data.cart);
    },
  });
}
