"use client";

import { clsx } from "clsx";
import type { ProductVariant } from "@/src/types/product";

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
    <div className="space-y-2.5">
      {variants.map((variant) => {
        const isSelected = variant.id === selectedVariantId;
        const isOutOfStock = variant.stock === 0;
        const isLowStock = !isOutOfStock && variant.stock <= 3;
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
              "w-full text-left cursor-pointer rounded-xl border-2 p-4 transition-all",
              isSelected
                ? "border-brand bg-brand-tint/50 shadow-sm"
                : "border-gray-100 hover:border-gray-200 bg-white",
              isOutOfStock &&
                "opacity-50 cursor-not-allowed hover:border-gray-100",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={clsx(
                    "flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                    isSelected ? "border-brand bg-brand" : "border-gray-300",
                  )}
                >
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {variant.length}" · {variant.color}
                    {variant.laceType && ` · ${variant.laceType}`}
                    {variant.closureSize && ` · ${variant.closureSize}`}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {isDiscounted ? (
                      <>
                        <span className="text-brand font-semibold text-sm">
                          ₦{variant.discountedPrice!.toLocaleString()}
                        </span>
                        <span className="text-gray-400 line-through text-xs">
                          ₦{variant.originalPrice!.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-brand font-semibold text-sm">
                        ₦{variant.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span
                className={clsx(
                  "flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap",
                  isOutOfStock
                    ? "bg-error/10 text-error"
                    : isLowStock
                      ? "bg-warning/10 text-warning"
                      : "bg-success/10 text-success",
                )}
              >
                {isOutOfStock
                  ? "Sold Out"
                  : isLowStock
                    ? `${variant.stock} left`
                    : "In Stock"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
