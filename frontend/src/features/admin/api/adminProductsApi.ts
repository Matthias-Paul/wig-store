import { apiFetch } from "@/src/lib/apiClient";
import type {
  Product,
  PaginatedProducts,
  ProductQueryParams,
} from "@/src/types/product";
import type {
  CreateProductPayload,
  CreateVariantPayload,
} from "@/src/types/admin-product";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}

export async function getAdminProducts(
  params: ProductQueryParams = {},
): Promise<PaginatedProducts> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  const res = await apiFetch(`/products/admin/all?${query.toString()}`);
  return handleResponse(res);
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  const res = await apiFetch("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateProduct(
  id: string,
  payload: Partial<CreateProductPayload>,
): Promise<Product> {
  const res = await apiFetch(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await apiFetch(`/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
}

export async function updateProductStatus(
  id: string,
  status: "draft" | "published",
) {
  const res = await apiFetch(`/products/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function createVariant(
  productId: string,
  payload: CreateVariantPayload,
) {
  const res = await apiFetch(`/products/${productId}/variants`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateVariant(
  productId: string,
  variantId: string,
  payload: Partial<CreateVariantPayload>,
) {
  const res = await apiFetch(`/products/${productId}/variants/${variantId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteVariant(
  productId: string,
  variantId: string,
): Promise<void> {
  const res = await apiFetch(`/products/${productId}/variants/${variantId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete variant");
  }
}

export async function uploadImage(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/uploads/image`,
    {
      method: "POST",
      credentials: "include",
      body: formData, // no Content-Type header — browser sets multipart boundary automatically
    },
  );
  return handleResponse(res);
}

export interface SetDiscountPayload {
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

export async function setDiscount(productId: string, payload: SetDiscountPayload) {
  const res = await apiFetch(`/products/${productId}/discount`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function removeDiscount(productId: string): Promise<void> {
  const res = await apiFetch(`/products/${productId}/discount`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove discount");
}