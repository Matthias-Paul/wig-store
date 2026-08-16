export interface CreateProductPayload {
  name: string;
  description: string;
  images: string[];
  categoryId: string;
}

export interface CreateVariantPayload {
  length: number;
  color: string;
  laceType?: string;
  closureSize?: string;
  price: number;
  stock: number;
}
