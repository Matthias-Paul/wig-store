import { Product } from '../../products/entities/product.entity';

export function isDiscountActive(product: Product): boolean {
  
  if (
    !product.discountPercentage ||
    !product.discountStartDate ||
    !product.discountEndDate
  ) {
    return false;
  }

  const now = new Date();
  return now >= product.discountStartDate && now <= product.discountEndDate;
}

export function getDiscountedPrice(
  originalPrice: number,
  product: Product,
): number {
  if (!isDiscountActive(product) || !product.discountPercentage) {
    return originalPrice;
  }

  const discount = (originalPrice * product.discountPercentage) / 100;
  return Number((originalPrice - discount).toFixed(2));
}
