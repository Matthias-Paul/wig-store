import Image from "next/image";
import type { Category } from "@/src/types/product";

interface ShopBannerProps {
  category?: Category;
}

export function ShopBanner({ category }: ShopBannerProps) {
  if (category) {
    return (
      <div className="relative h-48 md:h-64 overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-center">
          <span className="text-gold text-xs font-semibold tracking-widest uppercase mb-2">
            Category
          </span>
          <h1 className="font-heading text-3xl md:text-4xl text-white">
            {category.name}
          </h1>
          <p className="text-white/80 text-sm md:text-base mt-2 max-w-md">
            {category.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-brand via-brand to-gold py-14 md:py-20 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <span className="text-gold text-xs font-semibold tracking-widest uppercase mb-2 inline-block">
          The Full Collection
        </span>
        <h1 className="font-heading text-3xl md:text-4xl text-white">
          Shop All Products
        </h1>
        <p className="text-white/80 text-sm md:text-base mt-2 max-w-lg mx-auto">
          Premium bundles, closures, and luxury wigs — find your perfect match.
        </p>
      </div>
    </div>
  );
}
