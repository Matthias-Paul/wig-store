export interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  variant: {
    id: string;
    length: number;
    color: string;
    laceType?: string | null;
    closureSize?: string | null;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  landmark?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface CreateOrderPayload {
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  landmark?: string;
}
