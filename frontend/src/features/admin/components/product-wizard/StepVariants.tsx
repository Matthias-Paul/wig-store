"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useAdminProductDetail } from "@/src/features/admin/hooks/useAdminProductDetail";
import {
  useCreateVariant,
  useDeleteVariant,
  useUpdateVariant,
} from "@/src/features/admin/hooks/useProductMutations";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { Skeleton } from "@/src/components/ui/Skeleton";
import {
  formatVariantLength,
  isAccessoriesAndKitsCategory,
} from "@/src/lib/formatVariantLength";

const LACE_REQUIRED_SLUGS = ["luxury-hairs", "hair-bundles"];

const variantSchema = z.object({
  length: z.string().min(1, "Length is required").max(50),
  color: z.string().min(1, "Color is required"),
  laceType: z.string().optional(),
  closureSize: z.string().optional(),
  price: z.number().min(0, "Price is required"),
  stock: z.number().min(0, "Stock is required"),
});

type VariantFormValues = z.infer<typeof variantSchema>;

export function StepVariants({
  productId,
  onNext,
  onBack,
}: {
  productId: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const { data: product, isLoading } = useAdminProductDetail(productId);
  const createVariant = useCreateVariant(productId);
  const updateVariant = useUpdateVariant(productId);
  const deleteVariant = useDeleteVariant(productId);

  const [showForm, setShowForm] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VariantFormValues>({ resolver: zodResolver(variantSchema) });

  const laceRequired = product
    ? LACE_REQUIRED_SLUGS.includes(product.category.slug)
    : false;
  const isKitsCategory = product
    ? isAccessoriesAndKitsCategory(product.category.slug)
    : false;

  function openAddForm() {
    setEditingVariantId(null);
    reset({
      length: "",
      color: "",
      laceType: "",
      closureSize: "",
      price: undefined,
      stock: undefined,
    });
    setShowForm(true);
  }

  function openEditForm(
    variant: typeof product extends undefined
      ? never
      : NonNullable<typeof product>["variants"][number],
  ) {
    setEditingVariantId(variant.id);
    reset({
      length: variant.length,
      color: variant.color,
      laceType: variant.laceType ?? "",
      closureSize: variant.closureSize ?? "",
      price: variant.price,
      stock: variant.stock,
    });
    setShowForm(true);
  }

  function onSubmit(values: VariantFormValues) {
    const payload = {
      ...values,
      laceType: values.laceType || undefined,
      closureSize: values.closureSize || undefined,
    };

    if (editingVariantId) {
      updateVariant.mutate(
        { variantId: editingVariantId, payload },
        { onSuccess: () => setShowForm(false) },
      );
    } else {
      createVariant.mutate(payload, { onSuccess: () => setShowForm(false) });
    }
  }

  if (isLoading || !product) {
    return <Skeleton className="h-64 w-full max-w-2xl" />;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Variants for "{product.name}"
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {laceRequired
              ? "Lace type is required for this category."
              : "Each variant needs its own price and stock."}
          </p>
        </div>
        {!showForm && (
          <Button variant="outline" size="sm" onClick={openAddForm}>
            <Plus size={14} className="mr-1" /> Add Variant
          </Button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3 border border-gray-100"
        >
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={isKitsCategory ? "Length" : "Length (inches)"}
              placeholder={isKitsCategory ? "e.g. none" : "e.g. 14"}
              {...register("length")}
              error={errors.length?.message}
            />
            <Input
              label="Color"
              placeholder="e.g. Black"
              {...register("color")}
              error={errors.color?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Lace Type${laceRequired ? "" : " (optional)"}`}
              placeholder="e.g. Swiss Lace"
              {...register("laceType")}
            />
            <Input
              label="Closure Size (optional)"
              placeholder="e.g. 12 by 6"
              {...register("closureSize")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price (₦)"
              type="number"
              {...register("price", { valueAsNumber: true })}
              error={errors.price?.message}
            />
            <Input
              label="Stock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
              error={errors.stock?.message}
            />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={createVariant.isPending || updateVariant.isPending}
            >
              {editingVariantId ? "Save Changes" : "Add Variant"}
            </Button>
          </div>
        </form>
      )}

      {product.variants.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
          <p className="text-sm text-gray-400">No variants added yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Add at least one to be able to publish this product.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {product.variants.map((variant) => (
            <div
              key={variant.id}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formatVariantLength(
                    variant.length,
                    product.category.slug,
                  )}{" "}
                  · {variant.color}
                  {variant.laceType && ` · ${variant.laceType}`}
                  {variant.closureSize && ` · ${variant.closureSize}`}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-brand text-xs font-semibold">
                    ₦{variant.price.toLocaleString()}
                  </span>
                  <Badge variant={variant.stock > 0 ? "success" : "error"}>
                    {variant.stock} in stock
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditForm(variant)}
                  className="p-2 text-gray-400 hover:text-brand transition-colors"
                  aria-label="Edit variant"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deleteVariant.mutate(variant.id)}
                  className="p-2 text-gray-400 hover:text-error transition-colors"
                  aria-label="Delete variant"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={product.variants.length === 0}
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
}
