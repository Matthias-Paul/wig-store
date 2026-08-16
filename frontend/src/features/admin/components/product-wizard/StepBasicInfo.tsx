"use client";

import { useCreateProduct } from "@/src/features/admin/hooks/useProductMutations";
import { ProductInfoForm, type ProductInfoFormValues } from "./ProductInfoForm";

export function StepBasicInfo({
  onCreated,
}: {
  onCreated: (productId: string) => void;
}) {
  const createProduct = useCreateProduct();

  function handleSubmit(values: ProductInfoFormValues & { images: string[] }) {
    createProduct.mutate(values, {
      onSuccess: (product) => onCreated(product.id),
    });
  }

  return (
    <ProductInfoForm
      submitLabel="Continue to Variants"
      isSubmitting={createProduct.isPending}
      onSubmit={handleSubmit}
    />
  );
}
