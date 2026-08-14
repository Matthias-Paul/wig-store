"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/Button";
import type { ProductVariant } from "@/src/types/product";

interface StickyAddToCartBarProps {
  productName: string;
  selectedVariant: ProductVariant | null;
  onAddToCart: () => void;
  isPending: boolean;
}

export function StickyAddToCartBar({
  productName,
  selectedVariant,
  onAddToCart,
  isPending,
}: StickyAddToCartBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 480);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible || !selectedVariant) return null;

  const price = selectedVariant.discountedPrice ?? selectedVariant.price;
  const isOutOfStock = selectedVariant.stock === 0;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center gap-3 animate-slide-up">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 truncate">{productName}</p>
        <p className="font-heading text-base text-brand">
          ₦{price.toLocaleString()}
        </p>
      </div>
      <Button
        variant="primary"
        onClick={onAddToCart}
        disabled={isPending || isOutOfStock}
        className="flex-shrink-0"
      >
        {isPending ? "Adding..." : isOutOfStock ? "Sold Out" : "Add to Cart"}
      </Button>
    </div>
  );
}
