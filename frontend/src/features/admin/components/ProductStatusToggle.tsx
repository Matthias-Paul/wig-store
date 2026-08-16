"use client";

import { Badge } from "@/src/components/ui/Badge";
import { useUpdateProductStatus } from "../hooks/useProductMutations";
import { clsx } from "clsx";

export function ProductStatusToggle({
  productId,
  status,
  hasVariants,
}: {
  productId: string;
  status: "draft" | "published";
  hasVariants: boolean;
}) {
  const updateStatus = useUpdateProductStatus();

  function toggle() {
    const newStatus = status === "published" ? "draft" : "published";
    updateStatus.mutate({ id: productId, status: newStatus });
  }

  const isPublished = status === "published";
  const disabled = updateStatus.isPending || (!isPublished && !hasVariants);

  return (
    <button
      onClick={toggle}
      disabled={disabled}
      title={
        !isPublished && !hasVariants
          ? "Add at least one variant before publishing"
          : undefined
      }
      className={clsx(
        "disabled:opacity-50 disabled:cursor-not-allowed",
        !disabled && "cursor-pointer",
      )}
    >
      <Badge variant={isPublished ? "success" : "neutral"}>
        {isPublished ? "Published" : "Draft"}
      </Badge>
    </button>
  );
}
