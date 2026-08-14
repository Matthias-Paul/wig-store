// app/(customer)/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/src/features/orders/schemas/checkoutSchema";
import { useCheckout } from "@/src/features/orders/hooks/useCheckout";
import { useDeliveryFee } from "@/src/features/orders/hooks/useDeliveryFee";
import { useCart } from "@/src/features/cart/hooks/useCart";
import { useSession } from "@/src/features/auth/hooks/useSession";
import { Input } from "@/src/components/ui/Input";
import { Select } from "@/src/components/ui/Select";
import { Button } from "@/src/components/ui/Button";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { NIGERIAN_STATES } from "@/src/lib/nigerianStates";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: sessionLoading } = useSession();
  const { data: cart, isLoading: cartLoading } = useCart();
  const checkoutMutation = useCheckout();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      recipientName: user?.name ?? "",
      recipientEmail: user?.email ?? "",
    },
  });

  const selectedState = useWatch({ control, name: "shippingState" });
  const {
    data: deliveryFee,
    isLoading: feeLoading,
    isError: feeError,
    error: feeErrorObj,
  } = useDeliveryFee(selectedState);

  useEffect(() => {
    if (!sessionLoading && !isAuthenticated) {
      router.replace("/login?redirect=/checkout");
    }
  }, [sessionLoading, isAuthenticated, router]);

  function onSubmit(values: CheckoutFormValues) {
    if (!deliveryFee) return; // safety guard — shouldn't happen since button is disabled without it
    checkoutMutation.mutate(values, {
      onSuccess: ({ authorizationUrl }) => {
        window.location.href = authorizationUrl;
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

  const subtotal = cart.total;
  const orderTotal = deliveryFee
    ? subtotal + Number(deliveryFee.fee)
    : subtotal;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="font-heading text-2xl mb-6">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Recipient Name"
          {...register("recipientName")}
          error={errors.recipientName?.message}
        />
        <Input
          label="Phone Number"
          type="tel"
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
          <Select
            label="State"
            {...register("shippingState")}
            error={errors.shippingState?.message}
            options={[
              { label: "Select state", value: "" },
              ...NIGERIAN_STATES.map((state) => ({
                label: state,
                value: state,
              })),
            ]}
          />
        </div>

        <Input
          label="Landmark (optional)"
          placeholder="e.g. Opposite First Bank"
          {...register("landmark")}
          error={errors.landmark?.message}
        />

        {/* Order summary — updates live as state is selected */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            {!selectedState ? (
              <span className="text-gray-400">Select a state</span>
            ) : feeLoading ? (
              <span className="text-gray-400">Calculating...</span>
            ) : feeError ? (
              <span className="text-error text-xs">{feeErrorObj?.message}</span>
            ) : (
              <span>₦{Number(deliveryFee!.fee).toLocaleString()}</span>
            )}
          </div>

          <div className="flex text-brand justify-between font-semibold text-base border-t border-gray-200 pt-2 mt-2">
            <span>Total</span>
            <span>₦{orderTotal.toLocaleString()}</span>
          </div>
        </div>

        {checkoutMutation.isError && (
          <p className="text-error text-sm">{checkoutMutation.error.message}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={checkoutMutation.isPending || !deliveryFee || feeLoading}
        >
          {checkoutMutation.isPending
            ? "Processing..."
            : !selectedState
              ? "Select a state to continue"
              : `Continue to Payment · ₦${orderTotal.toLocaleString()}`}
        </Button>
      </form>
    </div>
  );
}
