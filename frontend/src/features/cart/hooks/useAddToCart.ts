import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../api/cartApi";
import { toast } from "sonner";

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: string;
      quantity: number;
    }) => addToCart(variantId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data.cart);
      toast.success("Added to cart");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
