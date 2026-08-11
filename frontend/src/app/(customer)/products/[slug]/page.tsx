"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProductDetail } from "@/src/features/products/hooks/useProductDetail";
import { VariantCardList } from "@/src/features/products/components/VariantCardList";
import { ProductImageGallery } from "@/src/features/products/components/ProductImageGallery";
import { useAddToCart } from "@/src/features/cart/hooks/useAddToCart";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { parseProductImages } from "@/src/lib/parseProductImages";
import type { ProductVariant } from "@/src/types/product";
import { ProductDetailSkeleton } from "@/src/features/products/components/ProductDetailsSkeleton";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProductDetail(slug);
  const addToCart = useAddToCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return  <ProductDetailSkeleton />
  }

  if (isError || !product) {
    return (
      <EmptyState
        title="Product not found"
        description="This product may have been removed."
      />
    );
  }

  const images = parseProductImages(product.images);

  function handleSelectVariant(variant: ProductVariant) {
    setSelectedVariant(variant);
    setQuantity(1); // reset quantity when switching variants, since stock differs per option
  }

  function handleAddToCart() {
    if (!selectedVariant) return;
    addToCart.mutate({ variantId: selectedVariant.id, quantity });
  }

  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-8">
      <ProductImageGallery images={images} alt={product.name} />

      <div>
        <h1 className="font-heading font-semibold text-2xl">{product.name}</h1>
        <p className="text-brand-light text-sm mt-1">{product.category.name}</p>
        <p className="mt-4 text-brand-light">{product.description}</p>

        <div className="mt-6">
          <p className="text-sm text-brand-light font-medium mb-2">
            Choose an option ({product.variants.length} available)
          </p>

          {product.variants.length === 0 ? (
            <Badge variant="neutral">
              Coming Soon — no options available yet
            </Badge>
          ) : (
            <VariantCardList
              variants={product.variants}
              selectedVariantId={selectedVariant?.id ?? null}
              onSelect={handleSelectVariant}
            />
          )}
        </div>

        {selectedVariant && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 cursor-pointer py-2 text-gray-600"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-3 min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(selectedVariant.stock, q + 1))
                  }
                  className="px-3 cursor-pointer py-2 text-gray-600"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="flex-1"
              >
                {addToCart.isPending ? "Adding..." : "Add to Cart"}
              </Button>
            </div>

            {addToCart.isError && (
              <p className="text-error text-sm mt-2">
                {addToCart.error.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
