

export interface ProductVariant {
  id: string;
  length: number;
  color: string;
  laceType?: string | null;
  closureSize?: string | null;
  sku: string;
  price: number;
  stock: number;
  originalPrice?: number;
  discountedPrice?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description:string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  status: "draft" | "published";
  category: Category;
  variants: ProductVariant[];
  variantCount?: number;
  isOnDiscount?: boolean;
  discountPercentage?: number | null;
  startingPrice?: number;
  discountedStartingPrice?: number;
}

export interface PaginatedProducts {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}
