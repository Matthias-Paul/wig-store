"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import { CategoryTile } from "@/src/features/categories/components/CategoryTile";
import { CategoryTileSkeleton } from "@/src/features/categories/components/CategoryTileSkeleton";

export function FeaturedCategories() {
  const { data: categories, isLoading, isError } = useCategories();

  if (isError) return null;

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Soft background wash, distinct from the hero's gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/60 to-white" />

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Header row — eyebrow + heading + "View All" link inline on desktop */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="text-center md:text-left">
            <span className="inline-block text-xs font-semibold tracking-widest text-gold uppercase mb-2">
              Explore
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-gray-900">
              Shop by Category
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Find exactly what you're looking for
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {isLoading
            ? [...Array(6)].map((_, i) => <CategoryTileSkeleton key={i} />)
            : categories?.map((category, index) => (
                <div
                  key={category.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <CategoryTile category={category} />
                </div>
              ))}
        </div>

        {/* Mobile-only "View All" */}
        <div className="text-center mt-8 md:hidden">
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
