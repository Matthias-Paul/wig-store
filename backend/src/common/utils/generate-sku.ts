export function generateSku(
  productName: string,
  length: number,
  color: string,
): string {
  const productCode = productName
    .split(' ')
    .map((word) => word.slice(0, 3).toUpperCase())
    .join('')
    .slice(0, 9); 

  const colorCode = color.slice(0, 3).toUpperCase();
  return `${productCode}-${length}-${colorCode}`;
}
