import { apiFetch, parseApiJson } from "@/src/lib/apiClient";
import { getGuestId } from "@/src/lib/guestId";
import type { Cart } from "@/src/types/cart";

function cartHeaders() {
  return { "X-Guest-Id": getGuestId() };
}

async function readErrorMessage(res: Response, fallback: string) {
  try {
    const error = await parseApiJson<{ message?: string }>(res);
    return error.message || fallback;
  } catch {
    return fallback;
  }
}

export async function getCart(): Promise<Cart> {
  const res = await apiFetch("/cart", { headers: cartHeaders() });
  if (!res.ok) throw new Error("Failed to load cart");
  return parseApiJson<Cart>(res);
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
    throw new Error(await readErrorMessage(res, "Failed to add to cart"));
  }
  return parseApiJson<{ cart: Cart }>(res);
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
): Promise<{ cart: Cart }> {
  const res = await apiFetch(`/cart/items/${itemId}`, {
    method: "PATCH",
    headers: cartHeaders(),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, "Failed to update item"));
  }
  return parseApiJson<{ cart: Cart }>(res);
}

export async function removeCartItem(itemId: string): Promise<{ cart: Cart }> {
  const res = await apiFetch(`/cart/items/${itemId}`, {
    method: "DELETE",
    headers: cartHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove item");
  return parseApiJson<{ cart: Cart }>(res);
}
