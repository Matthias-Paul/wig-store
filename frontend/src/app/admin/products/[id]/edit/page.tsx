"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/src/features/admin/components/AdminLayout";
import { useAdminProductDetail } from "@/src/features/admin/hooks/useAdminProductDetail";
import { useUpdateProduct } from "@/src/features/admin/hooks/useProductMutations";
import {
  ProductInfoForm,
  type ProductInfoFormValues,
} from "@/src/features/admin/components/product-wizard/ProductInfoForm";
import { StepVariants } from "@/src/features/admin/components/product-wizard/StepVariants";
import {
  EditProductTabs,
  type EditProductTab,
} from "@/src/features/admin/components/EditProductTabs";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { parseProductImages } from "@/src/lib/parseProductImages";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<EditProductTab>("info");

  const { data: product, isLoading } = useAdminProductDetail(id);
  const updateProduct = useUpdateProduct(id);

  function handleInfoSubmit(
    values: ProductInfoFormValues & { images: string[] },
  ) {
    updateProduct.mutate(values);
  }

  return (
    <AdminLayout title="Edit Product">
      <button
        onClick={() => router.push("/admin/products")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5"
      >
        <ArrowLeft size={15} /> Back to Products
      </button>

      {isLoading ? (
        <Skeleton className="h-96 w-full max-w-lg" />
      ) : !product ? (
        <EmptyState title="Product not found" />
      ) : (
        <>
          <EditProductTabs active={tab} onChange={setTab} />

          {tab === "info" && (
            <ProductInfoForm
              defaultValues={{
                name: product.name,
                description: product.description,
                categoryId: product.category.id,
              }}
              defaultImages={parseProductImages(product.images)}
              submitLabel="Save Changes"
              isSubmitting={updateProduct.isPending}
              onSubmit={handleInfoSubmit}
            />
          )}

          {tab === "variants" && (
            <StepVariants
              productId={id}
              onNext={() => router.push("/admin/products")}
              onBack={() => setTab("info")}
            />
          )}
        </>
      )}
    </AdminLayout>
  );
}
