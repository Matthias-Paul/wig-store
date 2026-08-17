"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { AdminLayout } from "@/src/features/admin/components/AdminLayout";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import { useDeleteCategory } from "@/src/features/admin/hooks/useCategoryMutations";
import { CategoryFormModal } from "@/src/features/admin/components/CategoryFormModal";
import { ConfirmDeleteModal } from "@/src/components/ui/ConfirmDeleteModal";
import { Button } from "@/src/components/ui/Button";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import type { Category } from "@/src/types/product";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const [formTarget, setFormTarget] = useState<Category | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  return (
    <AdminLayout title="Categories">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {categories &&
            `${categories.length} categor${categories.length !== 1 ? "ies" : "y"}`}
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setFormTarget("new")}
        >
          <Plus size={15} className="mr-1" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : !categories || categories.length === 0 ? (
        <EmptyState
          icon={<Tag size={44} />}
          title="No categories yet"
          description="Create your first category to start organizing products."
          action={
            <Button variant="primary" onClick={() => setFormTarget("new")}>
              Add Category
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative aspect-square rounded-xl overflow-hidden ring-1 ring-black/5"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-3.5">
                <h3 className="font-heading text-white text-sm">
                  {category.name}
                </h3>
              </div>

              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setFormTarget(category)}
                  className="h-8 w-8 cursor-pointer rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 hover:text-brand"
                  aria-label="Edit category"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(category)}
                  className="h-8 w-8 cursor-pointer rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 hover:text-error"
                  aria-label="Delete category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryFormModal
        category={formTarget === "new" ? null : formTarget}
        isOpen={formTarget !== null}
        onClose={() => setFormTarget(null)}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteCategory.mutate(deleteTarget.id, {
              onSuccess: () => setDeleteTarget(null),
            });
          }
        }}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone. Note: deletion will be blocked if any products still belong to this category.`}
        isPending={deleteCategory.isPending}
      />
    </AdminLayout>
  );
}
