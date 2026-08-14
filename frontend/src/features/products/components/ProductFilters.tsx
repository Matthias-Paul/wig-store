"use client";

import { useCategories } from "@/src/features/categories/hooks/useCategories";
import { SearchInput } from "@/src/components/ui/SearchInput";
import { Select } from "@/src/components/ui/Select";

interface ProductFiltersProps {
  search: string;
  categoryId: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function ProductFilters({
  search,
  categoryId,
  onSearchChange,
  onCategoryChange,
}: ProductFiltersProps) {
  const { data: categories } = useCategories();

  const categoryOptions = [
    { label: "All Categories", value: "" },
    ...(categories?.map((c) => ({ label: c.name, value: c.id })) ?? []),
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <SearchInput
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="sm:w-56">
        <Select
          options={categoryOptions}
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
        />
      </div>
    </div>
  );
}
