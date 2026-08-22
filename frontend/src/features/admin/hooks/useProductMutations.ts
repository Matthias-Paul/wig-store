import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  createVariant,
  updateVariant,
  deleteVariant,
  SetDiscountPayload,
  setDiscount,
  removeDiscount,
} from "../api/adminProductsApi";
import type {
  CreateProductPayload,
  CreateVariantPayload,
} from "@/src/types/admin-product";

export function useCreateProduct() {
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateProduct(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreateProductPayload>) =>
      updateProduct(productId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-product", productId] });
      qc.invalidateQueries({ queryKey: ["products"] });

      toast.success("Product updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });

      toast.success("Product deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateProductStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "draft" | "published";
    }) => updateProductStatus(id, status),
    onSuccess: (_, { status }) => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });

      toast.success(
        status === "published" ? "Product published" : "Moved back to draft",
      );
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCreateVariant(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVariantPayload) =>
      createVariant(productId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-product", productId] });
      qc.invalidateQueries({ queryKey: ["products"] });

      toast.success("Variant added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateVariant(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      variantId,
      payload,
    }: {
      variantId: string;
      payload: Partial<CreateVariantPayload>;
    }) => updateVariant(productId, variantId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-product", productId] });
      qc.invalidateQueries({ queryKey: ["products"] });

      toast.success("Variant updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteVariant(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variantId: string) => deleteVariant(productId, variantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-product", productId] });
      qc.invalidateQueries({ queryKey: ["products"] });

      toast.success("Variant removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useSetDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: SetDiscountPayload;
    }) => setDiscount(productId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(
        "Discount scheduled successfully. It will activate on the start date.",
      );
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRemoveDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => removeDiscount(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Discount removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
