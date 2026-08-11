// app/(customer)/checkout/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/src/features/orders/schemas/checkoutSchema";
import { useCheckout } from "@/src/features/orders/hooks/useCheckout";
import { useCart } from "@/src/features/cart/hooks/useCart";
import { useSession } from "@/src/features/auth/hooks/useSession";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: sessionLoading } = useSession();
  const { data: cart, isLoading: cartLoading } = useCart();
  const checkoutMutation = useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      recipientName: user?.name ?? "",
      recipientEmail: user?.email ?? "",
    },
  });

  // Guard: must be logged in to reach checkout at all
  useEffect(() => {
    if (!sessionLoading && !isAuthenticated) {
      router.replace("/login?redirect=/checkout");
    }
  }, [sessionLoading, isAuthenticated, router]);

  function onSubmit(values: CheckoutFormValues) {
    checkoutMutation.mutate(values, {
      onSuccess: ({ authorizationUrl }) => {
        window.location.href = authorizationUrl; // redirect to Paystack's hosted page
      },
    });
  }

  if (sessionLoading || cartLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-3">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add items to your cart before checking out."
        action={
          <Button onClick={() => router.push("/products")}>
            Browse Products
          </Button>
        }
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="font-heading text-2xl mb-6">Checkout</h1>

      <div className="bg-brand-tint rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700">
          {cart.items.length} item{cart.items.length > 1 ? "s" : ""} · Total:{" "}
          <span className="font-semibold text-brand">
            ₦{cart.total.toLocaleString()}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Recipient Name"
          {...register("recipientName")}
          error={errors.recipientName?.message}
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+2348012345678"
          {...register("recipientPhone")}
          error={errors.recipientPhone?.message}
        />
        <Input
          label="Email"
          type="email"
          {...register("recipientEmail")}
          error={errors.recipientEmail?.message}
        />
        <Input
          label="Shipping Address"
          {...register("shippingAddress")}
          error={errors.shippingAddress?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            {...register("shippingCity")}
            error={errors.shippingCity?.message}
          />
          <Input
            label="State"
            {...register("shippingState")}
            error={errors.shippingState?.message}
          />
        </div>

        <Input
          label="Landmark (optional)"
          placeholder="e.g. Opposite First Bank"
          {...register("landmark")}
          error={errors.landmark?.message}
        />

        {checkoutMutation.isError && (
          <p className="text-error text-sm">{checkoutMutation.error.message}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={checkoutMutation.isPending}
        >
          {checkoutMutation.isPending
            ? "Processing..."
            : `Continue to Payment · ₦${cart.total.toLocaleString()}`}
        </Button>
      </form>
    </div>
  );
}
