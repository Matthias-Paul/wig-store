import { Button } from "@/src/components/ui/Button";
import type { Cart } from "@/src/types/cart";

export function CartSummary({
  cart,
  onCheckout,
}: {
  cart: Cart;
  onCheckout: () => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="font-heading text-brand text-lg mb-3">Order Summary</h2>
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>
          Items ({cart.items.reduce((sum, i) => sum + i.quantity, 0)})
        </span>
        <span>₦{cart.total.toLocaleString()}</span>
      </div>
      <div className="flex text-brand items-center justify-between font-semibold text-base border-t border-gray-100 pt-2 mt-2">
        <span>Total</span>
        <span>₦{cart.total.toLocaleString()}</span>
      </div>
      <Button variant="primary" className="w-full mt-4" onClick={onCheckout}>
        Proceed to Checkout
      </Button>
    </div>
  );
}
