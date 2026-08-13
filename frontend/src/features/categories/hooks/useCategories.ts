import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categoriesApi";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // categories barely change — cache longer than products
  });
}
