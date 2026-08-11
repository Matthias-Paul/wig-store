import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItem } from "../api/cartApi";

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data.cart);
    },
  });
}
