"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/src/features/cart/hooks/useCart";
import { useSession } from "@/src/features/auth/hooks/useSession";
import { CartItemRow } from "@/src/features/cart/components/CartItemRow";
import { CartSummary } from "@/src/features/cart/components/CartSummary";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Button } from "@/src/components/ui/Button";

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const { isAuthenticated } = useSession();

  function handleCheckout() {
    if (!isAuthenticated) {
      // Trigger Google sign-in first — checkout requires login, as designed
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag size={48} />}
        title="Your cart is empty"
        description="Looks like you haven't added anything yet."
        action={
          <Button variant="primary" onClick={() => router.push("/products")}>
            Browse Products
          </Button>
        }
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="font-heading text-2xl mb-4">Your Cart</h1>
        {cart.items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>

      <div>
        <CartSummary cart={cart} onCheckout={handleCheckout} />
      </div>
    </div>
  );
}
