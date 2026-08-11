import { apiFetch } from "@/src/lib/apiClient";
import { getGuestId } from "@/src/lib/guestId";
import type { Cart } from "@/src/types/cart";

function cartHeaders() {
  return { "X-Guest-Id": getGuestId() };
}

export async function getCart(): Promise<Cart> {
  const res = await apiFetch("/cart", { headers: cartHeaders() });
  if (!res.ok) throw new Error("Failed to load cart");
  return res.json();
}

export async function addToCart(
  variantId: string,
  quantity: number,
): Promise<{ cart: Cart }> {
  const res = await apiFetch("/cart/items", {
    method: "POST",
    headers: cartHeaders(),
    body: JSON.stringify({ variantId, quantity }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add to cart");
  }
  return res.json();
}

export async function updateCartItem(itemId: string, quantity: number): Promise<{ cart: Cart }> {
  const res = await apiFetch(`/cart/items/${itemId}`, {
    method: 'PATCH',
    headers: cartHeaders(),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update item');
  }
  return res.json();
}

export async function removeCartItem(itemId: string): Promise<{ cart: Cart }> {
  const res = await apiFetch(`/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: cartHeaders(),
  });
  if (!res.ok) throw new Error('Failed to remove item');
  return res.json();
}