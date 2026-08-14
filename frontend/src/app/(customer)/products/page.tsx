import { Suspense } from "react";
import ProductsPageContent from "@/src/features/products/components/ProductsPageContent";
export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
