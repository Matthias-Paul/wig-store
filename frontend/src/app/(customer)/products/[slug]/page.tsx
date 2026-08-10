"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useProductDetail } from "@/src/features/products/hooks/useProductDetail";
import { VariantSelector } from "@/src/features/products/components/VariantSelector";
import { useAddToCart } from "@/src/features/cart/hooks/useAddToCart";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { EmptyState } from "@/src/components/ui/EmptyState";
import type { ProductVariant } from "@/src/types/product";
import { ProductDetailSkeleton } from "@/src/features/products/components/ProductDetailsSkeleton";
import { parseProductImages } from "@/src/lib/parseProductImages";
import { ProductImageGallery } from "@/src/features/products/components/ProductImageGallery";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProductDetail(slug);
  const addToCart = useAddToCart();
  

  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (isError || !product) {
    return (
      <EmptyState
        title="Product not found"
        description="This product may have been removed."
      />
    );
  }

  function handleAddToCart() {
    if (!selectedVariant) return;
    addToCart.mutate({ variantId: selectedVariant.id, quantity });
  }

  const images = parseProductImages(product.images);

  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-8">
        <div className="w-full rounded-lg">
          <ProductImageGallery images={images} alt={product.name} />
        </div>

      <div>
        <h1 className="font-heading text-2xl">{product.name}</h1>
        <p className="text-gray-500 text-sm mt-1">{product.category.name}</p>
        <p className="text-gray-700 mt-4">{product.description}</p>

        {product.variants.length === 0 ? (
          <div className="mt-6">
            <Badge variant="neutral">
              Coming Soon — no options available yet
            </Badge>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <VariantSelector
                variants={product.variants}
                onVariantChange={setSelectedVariant}
              />
            </div>

            {selectedVariant && (
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  {selectedVariant.discountedPrice !== undefined &&
                  selectedVariant.discountedPrice <
                    selectedVariant.originalPrice! ? (
                    <>
                      <span className="text-2xl font-semibold text-brand">
                        ₦{selectedVariant.discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-gray-400 line-through">
                        ₦{selectedVariant.originalPrice!.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-semibold text-brand">
                      ₦{selectedVariant.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-sm mt-1">
                  {selectedVariant.stock > 0 ? (
                    <span className="text-success">
                      {selectedVariant.stock} in stock
                    </span>
                  ) : (
                    <span className="text-error">Out of stock</span>
                  )}
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-gray-600"
                    >
                      −
                    </button>
                    <span className="px-3">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(selectedVariant.stock, q + 1),
                        )
                      }
                      className="px-3 py-2 text-gray-600"
                    >
                      +
                    </button>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleAddToCart}
                    disabled={
                      selectedVariant.stock === 0 || addToCart.isPending
                    }
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
          </>
        )}
      </div>
    </div>
  );
}
