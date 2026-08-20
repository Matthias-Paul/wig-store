"use client";

import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductGridSkeleton";

export function RelatedProducts({
  categoryId,
  excludeProductId,
}: {
  categoryId: string;
  excludeProductId: string;
}) {
  const { data, isLoading } = useProducts({ categoryId, limit: 5 });

  const related =
    data?.products.filter((p) => p.id !== excludeProductId).slice(0, 4) ?? [];

  if (!isLoading && related.length === 0) return null;

  return (
    <section className="bg-gray-50/70 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-semibold tracking-widest text-gold uppercase mb-2">
            Complete the Look
          </span>
          <h2 className="font-heading text-2xl md:text-3xl text-gray-900">
            You May Also Like
          </h2>
        </div>

        {isLoading ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
