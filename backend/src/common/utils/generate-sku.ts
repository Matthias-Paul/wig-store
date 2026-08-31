export function generateSku(
  productName: string,
  length: string,
  color: string,
): string {
  const productCode = productName
    .split(' ')
    .map((word) => word.slice(0, 3).toUpperCase())
    .join('')
    .slice(0, 9);

  const lengthCode = length.replace(/\s+/g, '').toUpperCase().slice(0, 12);
  const colorCode = color.slice(0, 3).toUpperCase();
  return `${productCode}-${lengthCode}-${colorCode}`;
}
