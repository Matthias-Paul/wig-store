"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { useProducts } from "@/src/features/products/hooks/useProducts";
import { ProductCard } from "@/src/features/products/components/ProductCard";
import { ProductGridSkeleton } from "@/src/features/products/components/ProductGridSkeleton";

export function FeaturedProducts() {
  const { data, isLoading, isError } = useProducts({ limit: 8 });

  if (isError) return null;

  const products = data?.products ?? [];
  const hasDiscounts = products.some((p) => p.isOnDiscount);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="relative py-16 md:py-20 bg-gray-50/70">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="text-center md:text-left">
            <h2 className="font-heading text-3xl md:text-4xl text-gray-900">
              {hasDiscounts ? "Trending And On Sale" : "New Arrivals"}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {hasDiscounts
                ? "Grab these before the offer ends"
                : "Freshly added to the collection"}
            </p>
          </div>

          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:gap-2.5 transition-all self-center"
          >
            View All Products
            <ArrowRight size={15} />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.slice(0, 8).map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand"
          >
            View All Products <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
