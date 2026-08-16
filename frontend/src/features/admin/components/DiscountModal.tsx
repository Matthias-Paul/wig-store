"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import {
  useSetDiscount,
  useRemoveDiscount,
} from "../hooks/useProductMutations";
import type { Product } from "@/src/types/product";

const schema = z.object({
  discountPercentage: z
    .number()
    .min(1, "Must be at least 1%")
    .max(90, "Cannot exceed 90%"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

type FormValues = z.infer<typeof schema>;

export function DiscountModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const setDiscount = useSetDiscount();
  const removeDiscount = useRemoveDiscount();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      discountPercentage: product?.discountPercentage ?? undefined,
    },
  });

  if (!product) return null;

  function onSubmit(values: FormValues) {
    setDiscount.mutate(
      { productId: product!.id, payload: values },
      { onSuccess: onClose },
    );
  }

  function handleRemove() {
    removeDiscount.mutate(product!.id, { onSuccess: onClose });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Discount — ${product.name}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Discount Percentage"
          type="number"
          placeholder="e.g. 20"
          {...register("discountPercentage", {
            valueAsNumber: true,
          })}
          error={errors.discountPercentage?.message}
        />
        <Input
          label="Starts"
          type="datetime-local"
          {...register("startDate")}
          error={errors.startDate?.message}
        />
        <Input
          label="Ends"
          type="datetime-local"
          {...register("endDate")}
          error={errors.endDate?.message}
        />

        <div className="flex items-center justify-between pt-2">
          {product.isOnDiscount ? (
            <button
              type="button"
              onClick={handleRemove}
              disabled={removeDiscount.isPending}
              className="text-sm text-error cursor-pointer hover:underline"
            >
              {removeDiscount.isPending
                ? "Removing..."
                : "Remove current discount?"}
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={setDiscount.isPending}
            >
              {setDiscount.isPending ? "Applying..." : "Apply Discount"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
