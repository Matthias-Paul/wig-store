"use client";

import { clsx } from "clsx";
import type { ProductVariant } from "@/src/types/product";
import { Badge } from "@/src/components/ui/Badge";

interface VariantCardListProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variant: ProductVariant) => void;
}

export function VariantCardList({
  variants,
  selectedVariantId,
  onSelect,
}: VariantCardListProps) {
  return (
    <div className="space-y-2">
      {variants.map((variant) => {
        const isSelected = variant.id === selectedVariantId;
        const isOutOfStock = variant.stock === 0;
        const isDiscounted =
          variant.discountedPrice !== undefined &&
          variant.originalPrice !== undefined &&
          variant.discountedPrice < variant.originalPrice;

        return (
          <button
            key={variant.id}
            onClick={() => !isOutOfStock && onSelect(variant)}
            disabled={isOutOfStock}
            className={clsx(
              "w-full text-left cursor-pointer rounded-lg border p-3 transition-colors",
              isSelected
                ? "border-brand bg-brand/40 hover:bg-brand/20"
                : "border-gray-200 hover:border-gray-300",
              isOutOfStock && "opacity-50 cursor-not-allowed",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium ">
                  {variant.length}" · {variant.color}
                  {variant.laceType && ` · ${variant.laceType}`}
                  {variant.closureSize && ` · ${variant.closureSize}`}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {isDiscounted ? (
                    <>
                      <span className=" font-semibold text-sm">
                        ₦{variant.discountedPrice!.toLocaleString()}
                      </span>
                      <span className=" line-through text-xs">
                        ₦{variant.originalPrice!.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className=" font-semibold text-sm">
                      ₦{variant.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <Badge
                variant={
                  isOutOfStock
                    ? "error"
                    : variant.stock <= 3
                      ? "warning"
                      : "success"
                }
              >
                {isOutOfStock
                  ? "Sold Out"
                  : variant.stock <= 3
                    ? `${variant.stock} left`
                    : "In Stock"}
              </Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
}
