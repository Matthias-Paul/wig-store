import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryPayload,
} from "../api/adminCategoriesApi";

function invalidateCategories(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["categories"] }); // shared with the customer-facing hook
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: () => {
      invalidateCategories(qc);
      toast.success("Category created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CategoryPayload>) =>
      updateCategory(id, payload),
    onSuccess: () => {
      invalidateCategories(qc);
      toast.success("Category updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      invalidateCategories(qc);
      toast.success("Category deleted");
    },
    onError: (e: Error) => toast.error(e.message), // surfaces the backend's "still has products" message directly
  });
}
