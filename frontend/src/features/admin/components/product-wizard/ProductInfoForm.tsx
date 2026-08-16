"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { Select } from "@/src/components/ui/Select";
import { ImageUploader } from "@/src/components/ui/ImageUploader";
import { Button } from "@/src/components/ui/Button";

const schema = z.object({
  name: z.string().min(1, "Product name is required").max(150),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Please select a category"),
});

const EMPTY_IMAGES: string[] = [];

export type ProductInfoFormValues = z.infer<typeof schema>;

interface ProductInfoFormProps {
  defaultValues?: Partial<ProductInfoFormValues>;
  defaultImages?: string[];
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: ProductInfoFormValues & { images: string[] }) => void;
}

export function ProductInfoForm({
  defaultValues,
  defaultImages = EMPTY_IMAGES,
  submitLabel,
  isSubmitting,
  onSubmit,
}: ProductInfoFormProps) {
  const { data: categories } = useCategories();
  const [images, setImages] = useState<string[]>(defaultImages);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInfoFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // If defaultValues arrive asynchronously (e.g. after the product finishes loading),
  // populate the form once they're available
  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  function handleFormSubmit(values: ProductInfoFormValues) {
    onSubmit({ ...values, images });
  }

  const categoryOptions = [
    { label: "Select a category", value: "" },
    ...(categories?.map((c) => ({ label: c.name, value: c.id })) ?? []),
  ];

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-5 max-w-lg"
    >
      <Input
        label="Product Name"
        placeholder="e.g. Kimkay Closure"
        {...register("name")}
        error={errors.name?.message}
      />

      <Textarea
        label="Description"
        placeholder="Describe the hair — texture, origin, what makes it special..."
        {...register("description")}
        error={errors.description?.message}
      />

      <Select
        label="Category"
        options={categoryOptions}
        {...register("categoryId")}
        error={errors.categoryId?.message}
      />

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Product Images
        </label>
        <ImageUploader images={images} onChange={setImages} />
        {images.length === 0 && (
          <p className="text-xs text-error mt-1.5">
            At least one image is required
          </p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || images.length === 0}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
