/**
 * URL-safe slug from a product/category name.
 * Strips accents, apostrophes, and non-alphanumerics.
 * Returns "product" when the input has no usable characters (avoids empty slugs).
 */
export function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return base || 'product';
}
