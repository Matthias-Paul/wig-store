import { FeaturedCategories } from "@/src/features/categories/components/FeaturedCategories";
import { Hero } from "@/src/features/home/components/Hero";
import { ProductGrid } from "@/src/features/products/components/ProductGrid";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />

      <div className="px-4" >
        <ProductGrid filters={{}} />
      </div>
      {/* more sections coming: featured categories, featured products, etc. */}
    </div>
  );
}
