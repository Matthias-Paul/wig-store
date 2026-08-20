"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { ImageUploader } from "@/src/components/ui/ImageUploader";
import {
  useCreateCategory,
  useUpdateCategory,
} from "../hooks/useCategoryMutations";
import type { Category } from "@/src/types/product";
import { Textarea } from "@/src/components/ui/Textarea";

const schema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().min(1, "Category description is required").max(400),
});

type FormValues = z.infer<typeof schema>;

export function CategoryFormModal({
  category,
  isOpen,
  onClose,
}: {
  category: Category | null; // null = creating new
  isOpen: boolean;
  onClose: () => void;
}) {
  const isEditing = !!category;
  const [images, setImages] = useState<string[]>(
    category ? [category.image] : [],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(category?.id ?? "");
  const isPending = createCategory.isPending || updateCategory.isPending;

  useEffect(() => {
    if (isOpen) {
      reset({ name: category?.name ?? "" });
      reset({ description: category?.description ?? "" });
      setImages(category ? [category.image] : []);
    }
  }, [isOpen, category, reset]);

  function onSubmit(values: FormValues) {
    if (images.length === 0) return;
    const payload = { name: values.name, description: values.description, image: images[0] };

    if (isEditing) {
      updateCategory.mutate(payload, { onSuccess: onClose });
    } else {
      createCategory.mutate(payload, { onSuccess: onClose });
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Category" : "New Category"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Category Name"
          placeholder="e.g. Hair Bundles"
          {...register("name")}
          error={errors.name?.message}
        />
        <Textarea
          label="Category Description"
          placeholder="e.g.  Budget friendly wigs for a flawless look."
          {...register("description")}
          error={errors.description?.message}
        />

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Category Image
          </label>
          <ImageUploader images={images} onChange={setImages} maxImages={1} />
          {images.length === 0 && (
            <p className="text-xs text-error mt-1.5">An image is required</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isPending || images.length === 0}
          >
            {isPending
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
