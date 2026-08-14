"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/src/features/products/hooks/useProducts";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import { ProductCard } from "@/src/features/products/components/ProductCard";
import { ProductGridSkeleton } from "@/src/features/products/components/ProductGridSkeleton";
import { ProductFilters } from "@/src/features/products/components/ProductFilters";
import { ShopBanner } from "@/src/features/products/components/ShopBanner";
import { Pagination } from "@/src/components/ui/Pagination";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Button } from "@/src/components/ui/Button";

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategoryId = searchParams.get("categoryId") ?? "";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategoryId);

  const { data: categories } = useCategories();
  const activeCategory = useMemo(
    () => categories?.find((c) => c.id === categoryId),
    [categories, categoryId],
  );

  const { data, isLoading, isError } = useProducts({
    page,
    search: search || undefined,
    categoryId: categoryId || undefined,
    limit: 12,
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategoryId(value);
    setPage(1);
    router.replace(value ? `/products?categoryId=${value}` : "/products", {
      scroll: false,
    });
  }

  return (
    <div>
      <ShopBanner category={activeCategory} />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-5 text-gray-400">
          <SlidersHorizontal size={15} />
          <span className="text-xs font-medium uppercase tracking-wide">
            Filter & Search
          </span>
        </div>

        <ProductFilters
          search={search}
          categoryId={categoryId}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
        />

        <div className="mt-8">
          {isLoading ? (
            <ProductGridSkeleton />
          ) : isError ? (
            <EmptyState
              title="Something went wrong"
              description="We couldn't load products right now. Please try again."
            />
          ) : !data || data.products.length === 0 ? (
            <EmptyState
              title="No products found"
              description={
                search || categoryId
                  ? "Try adjusting your search or filters."
                  : "Check back soon — new products are on the way."
              }
              action={
                search || categoryId ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      handleCategoryChange("");
                    }}
                  >
                    Clear Filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-5">
                Showing {data.products.length} of {data.pagination.total}{" "}
                product
                {data.pagination.total !== 1 ? "s" : ""}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {data.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-10">
                <Pagination
                  currentPage={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
