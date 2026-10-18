import { useQuery } from "@tanstack/react-query";
import { getProductById, getProductBySlug } from "../api/productsApi";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeParam(
  value: string | string[] | undefined,
): string {
  if (!value) return "";
  const raw = Array.isArray(value) ? value[0] : value;
  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
}

async function loadProductBySlugOrId(slug: string): Promise<Awaited<
  ReturnType<typeof getProductBySlug>
>> {
  if (UUID_RE.test(slug)) {
    return getProductById(slug);
  }

  try {
    return await getProductBySlug(slug);
  } catch (slugError) {
    // Last resort: some environments only resolve the id endpoint reliably
    try {
      return await getProductById(slug);
    } catch {
      throw slugError;
    }
  }
}

export function useProductDetail(slug: string | string[] | undefined) {
  const normalized = normalizeParam(slug);
  return useQuery({
    queryKey: ["product", "slug", normalized],
    queryFn: () => loadProductBySlugOrId(normalized),
    enabled: !!normalized,
    retry: 2,
  });
}

export function useProductDetailById(id: string | string[] | undefined) {
  const normalized = normalizeParam(id);
  return useQuery({
    queryKey: ["product", "id", normalized],
    queryFn: () => getProductById(normalized),
    enabled: !!normalized,
    retry: 2,
  });
}
