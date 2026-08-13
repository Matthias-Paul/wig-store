import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/src/types/product";

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/products?categoryId=${category.id}`}
      className="group relative aspect-square rounded-2xl overflow-hidden block ring-1 ring-black/5 shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 768px) 50vw, 25vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-brand/80" />

      <div className="absolute bottom-0 left-0 right-0 p-3.5 flex items-end justify-between">
        <h3 className="font-heading text-white text-sm md:text-base leading-tight">
          {category.name}
        </h3>
        <span className="flex-shrink-0 h-7 w-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}
