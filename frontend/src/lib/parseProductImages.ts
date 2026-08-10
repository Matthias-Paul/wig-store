export function parseProductImages(images: string[]): string[] {
  return images
    .flatMap((entry) => entry.split(","))
    .map((url) => url.trim())
    .filter(Boolean);
}
