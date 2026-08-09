"use client";

import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductGridSkeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import type { ProductQueryParams } from "@/src/types/product";

export function ProductGrid({ filters }: { filters: ProductQueryParams }) {
  const { data, isLoading, isError } = useProducts(filters);

  if (isLoading) return <ProductGridSkeleton />;

  if (isError) {
    return (
      <EmptyState
        title="Something went wrong"
        description="We couldn't load products right now. Please try again."
      />
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your filters or check back soon."
      />
    );
  }

  return (
    <div className="grid w-full grid-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
