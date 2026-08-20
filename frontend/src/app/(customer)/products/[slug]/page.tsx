"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProductDetail } from "@/src/features/products/hooks/useProductDetail";
import { VariantCardList } from "@/src/features/products/components/VariantCardList";
import { ProductImageGallery } from "@/src/features/products/components/ProductImageGallery";
import { RelatedProducts } from "@/src/features/products/components/RelatedProducts";
// import { StickyAddToCartBar } from "@/src/features/products/components/StickyAddToCartBar";
import { ShareButtons } from "@/src/features/products/components/ShareButtons";
import { useAddToCart } from "@/src/features/cart/hooks/useAddToCart";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Breadcrumb } from "@/src/components/ui/Breadcrumb";
import { parseProductImages } from "@/src/lib/parseProductImages";
import type { ProductVariant } from "@/src/types/product";
import FAQPage from "@/src/features/home/components/Faq";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProductDetail(slug);
  const addToCart = useAddToCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-10 py-8">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
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
    setQuantity(1);
  }

  function handleAddToCart() {
    if (!selectedVariant) return;
    addToCart.mutate({ variantId: selectedVariant.id, quantity });
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            {
              label: product.category.name,
              href: `/products?categoryId=${product.category.id}`,
            },
            { label: product.name },
          ]}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-14 grid md:grid-cols-2 gap-10">
        <ProductImageGallery images={images} alt={product.name} />

        <div>
          {product.isOnDiscount && (
            <Badge variant="gold">{product.discountPercentage}% OFF</Badge>
          )}

          <h1 className="font-heading text-2xl md:text-3xl text-brand dark:text-white mt-2">
            {product.name}
          </h1>
          <p className="text-brand dark:text-white text-sm mt-1">
            {product.category.name}
          </p>

          <p className="text-brand dark:text-white mt-5 leading-relaxed text-sm">
            {product.description}
          </p>

          <div className="mt-7">
            <div className="flex items-center text-brand dark:text-white justify-between mb-3">
              <p className="text-sm font-semibold">Choose an Option</p>
              <span className="text-xs ">
                {product.variants.length} available
              </span>
            </div>

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
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2.5 text-gray-500 hover:text-gray-900 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-3 min-w-[2rem] text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(selectedVariant.stock, q + 1))
                    }
                    className="px-3.5 py-2.5 text-gray-500 hover:text-gray-900 transition-colors"
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
                <p className="text-error text-xs mt-2">
                  {addToCart.error.message}
                </p>
              )}
            </div>
          )}

          <div className="mt-6">
            <ShareButtons productName={product.name} />
          </div>
        </div>
      </div>

      <RelatedProducts
        categoryId={product.category.id}
        excludeProductId={product.id}
      />

      <FAQPage/>

      {/* <StickyAddToCartBar
        productName={product.name}
        selectedVariant={selectedVariant}
        onAddToCart={handleAddToCart}
        isPending={addToCart.isPending}
      /> */}
    </>
  );
}
