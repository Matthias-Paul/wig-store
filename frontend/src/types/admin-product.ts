export interface CreateProductPayload {
  name: string;
  description: string;
  images: string[];
  categoryId: string;
}

export interface CreateVariantPayload {
  length: string;
  color: string;
  laceType?: string;
  closureSize?: string;
  price: number;
  stock: number;
}
