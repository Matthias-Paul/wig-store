"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Info, CheckCircle2 } from "lucide-react";
import { useAdminProductDetail } from "@/src/features/admin/hooks/useAdminProductDetail";
import { useUpdateProductStatus } from "@/src/features/admin/hooks/useProductMutations";
import { Button } from "@/src/components/ui/Button";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { parseProductImages } from "@/src/lib/parseProductImages";

export function StepReviewPublish({
  productId,
  onBack,
}: {
  productId: string;
  onBack: () => void;
}) {
  const router = useRouter();
  const { data: product, isLoading } = useAdminProductDetail(productId);
  const updateStatus = useUpdateProductStatus();

  if (isLoading || !product) {
    return <Skeleton className="h-64 w-full max-w-2xl" />;
  }

  const images = parseProductImages(product.images);
  const prices = product.variants.map((v) => v.price);
  const priceRange =
    prices.length > 0
      ? Math.min(...prices) === Math.max(...prices)
        ? `₦${Math.min(...prices).toLocaleString()}`
        : `₦${Math.min(...prices).toLocaleString()} – ₦${Math.max(...prices).toLocaleString()}`
      : "No variants";

  function handlePublish() {
    updateStatus.mutate(
      { id: productId, status: "published" },
      { onSuccess: () => router.push("/admin/products") },
    );
  }

  function handleSaveDraft() {
    router.push("/admin/products");
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4">
        <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-heading text-base text-gray-900">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {product.category.name}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
            <span>
              {product.variants.length} variant
              {product.variants.length !== 1 ? "s" : ""}
            </span>
            <span className="text-brand font-semibold">{priceRange}</span>
          </div>
        </div>
      </div>

      <div className="bg-brand-tint/50 border border-brand/10 rounded-xl p-4 mt-5 flex gap-3">
        <Info size={18} className="text-brand flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-900">
            What does publishing do?
          </p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Publishing makes this product visible to customers on the storefront
            immediately. You can always unpublish it later to pull it offline
            without deleting anything — your product and variant data stays
            intact.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <Button
            variant="primary"
            onClick={handlePublish}
            disabled={updateStatus.isPending}
          >
            {updateStatus.isPending ? (
              "Publishing..."
            ) : (
              <>
                <CheckCircle2 size={15} className="mr-1.5" /> Publish Now
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
