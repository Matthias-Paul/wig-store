export interface CartItemVariant {
  id: string;
  length: number;
  pattern: string;
  originalPrice: number;
  effectivePrice: number;
  stock: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  variant: CartItemVariant;
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}
