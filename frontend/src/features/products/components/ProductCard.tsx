import Link from "next/link";
import Image from "next/image";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import type { Product } from "@/src/types/product";
import { parseProductImages } from "@/src/lib/parseProductImages";

export function ProductCard({ product }: { product: Product }) {
  const hasStock = (product.variantCount ?? 0) > 0;

 const productImages = parseProductImages(product.images);
 const productImage = productImages[0] 

  return (
    <Card padding="none" className="overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <Image
          src={productImage} 
          alt={product.name}
          width={500}
          height={300}
          unoptimized
          className="w-full h-90 md:h-65 object-cover "
        />
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-heading text-black text-lg truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500">{product.category.name}</p>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {product.isOnDiscount ? (
            <>
              <span className="text-brand font-semibold">
                ₦{product.discountedStartingPrice?.toLocaleString()}
              </span>
              <span className="text-gray-400 line-through text-sm">
                ₦{product.startingPrice?.toLocaleString()}
              </span>
              <Badge variant="gold">{product.discountPercentage}% OFF</Badge>
            </>
          ) : (
            <span className="text-brand font-semibold">
              ₦{product.startingPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {hasStock ? (
          <Link href={`/products/${product.slug}`}>
            <Button variant="primary" className="w-full mt-3">
              View Options
            </Button>
          </Link>
        ) : (
          <Button variant="outline" className="w-full mt-3" disabled>
            Coming Soon
          </Button>
        )}
      </div>
    </Card>
  );
}
