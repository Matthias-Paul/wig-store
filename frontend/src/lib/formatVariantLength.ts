const NO_INCH_MARK_CATEGORY_SLUGS = ["accessories-and-kits"];

/** Formats variant length for display; omits " for kits/accessories or "none". */
export function formatVariantLength(
  length: string,
  categorySlug?: string | null,
): string {
  const trimmed = length.trim();
  if (!trimmed) return trimmed;

  const skipInchMark =
    (categorySlug != null &&
      NO_INCH_MARK_CATEGORY_SLUGS.includes(categorySlug)) ||
    trimmed.toLowerCase() === "none";

  if (skipInchMark) return trimmed;
  if (trimmed.endsWith('"')) return trimmed;
  return `${trimmed}"`;
}

export function isAccessoriesAndKitsCategory(
  categorySlug?: string | null,
): boolean {
  return (
    categorySlug != null &&
    NO_INCH_MARK_CATEGORY_SLUGS.includes(categorySlug)
  );
}
