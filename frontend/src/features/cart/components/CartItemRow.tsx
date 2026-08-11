"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useUpdateCartItem } from "../hooks/useUpdateCartItem";
import { useRemoveCartItem } from "../hooks/useRemoveCartItem";
import { parseProductImages } from "@/src/lib/parseProductImages";
import type { CartItem } from "@/src/types/cart";

export function CartItemRow({ item }: { item: CartItem }) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const images = parseProductImages(item.variant.product.images);
  const isDiscounted = item.variant.effectivePrice < item.variant.originalPrice;

  function handleQuantityChange(newQuantity: number) {
    if (newQuantity < 1) return;
    if (newQuantity > item.variant.stock) return;
    updateItem.mutate({ itemId: item.id, quantity: newQuantity });
  }

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
        <Image
          src={images[0]}
          alt={item.variant.product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {item.variant.product.name}
        </p>
        <p className="text-xs text-gray-500">
          {item.variant.length}" · {item?.variant?.color}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-brand font-semibold text-sm">
            ₦{item.variant.effectivePrice.toLocaleString()}
          </span>
          {isDiscounted && (
            <span className="text-gray-400 line-through text-xs">
              ₦{item.variant.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="px-2 py-1 text-gray-600 text-sm"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-3 text-sm">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.variant.stock}
              className="px-2 py-1 text-gray-600 text-sm disabled:opacity-30"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem.mutate(item.id)}
            aria-label="Remove item"
            className="text-gray-400 hover:text-error"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-sm">
          ₦{item.subtotal.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
