import { Suspense } from "react";
import ProductsPageContent from "@/src/features/products/components/ProductsPageContent";
import { ProductGridSkeleton } from "@/src/features/products/components/ProductGridSkeleton";
import { Skeleton } from "@/src/components/ui/Skeleton";

function ProductsPageFallback() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-40 mb-2" />
      <Skeleton className="h-4 w-64 mb-8" />
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Skeleton className="h-10 flex-1 sm:max-w-xs" />
        <Skeleton className="h-10 w-full sm:w-52" />
      </div>
      <ProductGridSkeleton />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}
