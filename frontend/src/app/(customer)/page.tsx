import { FeaturedCategories } from "@/src/features/categories/components/FeaturedCategories";
import { FeaturedProducts } from "@/src/features/home/components/FeaturedProducts";
import { FinalCTA } from "@/src/features/home/components/FinalCTA";
import { Hero } from "@/src/features/home/components/Hero";
import { Testimonials } from "@/src/features/home/components/Testimonials";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <Testimonials />
      <FinalCTA />

    </div>
  );
}
