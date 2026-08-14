"use client";

import { useRouter } from "next/navigation";
import { X, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useSession } from "@/src/features/auth/hooks/useSession";
import { useCartDrawer } from "../CartDrawerContext";
import { CartItemRow } from "./CartItemRow";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Button } from "@/src/components/ui/Button";

export function CartDrawer() {
  const { isOpen, close } = useCartDrawer();
  const { data: cart, isLoading } = useCart();
  const { isAuthenticated } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function handleCheckout() {
    close();
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  }

  function handleViewFullCart() {
    close();
    router.push("/cart");
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={close}
        aria-hidden="true"
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-heading text-brand  font-semibold text-lg">
            Your Cart
          </h2>
          <button
            onClick={close}
            aria-label="Close cart"
            className="text-brand cursor-pointer hover:text-gray-600"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag size={40} />}
              title="Your cart is empty"
              description="Add something you love."
              action={
                <Button
                  variant="primary"
                  onClick={() => router.push("/products")}
                >
                  Browse Products
                </Button>
              }
            />
          ) : (
            cart.items.map((item) => <CartItemRow key={item.id} item={item} />)
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex text-brand items-center justify-between font-semibold">
              <span>Total</span>
              <span>₦{cart.total.toLocaleString()}</span>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
            <button
              onClick={handleViewFullCart}
              className="w-full text-center cursor-pointer text-sm text-brand hover:underline"
            >
              View Full Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
