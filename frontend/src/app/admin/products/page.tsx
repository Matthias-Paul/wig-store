"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Percent, Pencil, Trash2, Package } from "lucide-react";
import { AdminLayout } from "@/src/features/admin/components/AdminLayout";
import { useAdminProducts } from "@/src/features/admin/hooks/useAdminProducts";
import { useDeleteProduct } from "@/src/features/admin/hooks/useProductMutations";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import { ProductStatusToggle } from "@/src/features/admin/components/ProductStatusToggle";
import { DiscountModal } from "@/src/features/admin/components/DiscountModal";
import { ConfirmDeleteModal } from "@/src/components/ui/ConfirmDeleteModal";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/src/components/ui/Table";
import { Pagination } from "@/src/components/ui/Pagination";
import { SearchInput } from "@/src/components/ui/SearchInput";
import { Select } from "@/src/components/ui/Select";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { parseProductImages } from "@/src/lib/parseProductImages";
import type { Product } from "@/src/types/product";

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [discountTarget, setDiscountTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data: categories } = useCategories();
  const { data, isLoading } = useAdminProducts({
    page,
    search: search || undefined,
    categoryId: categoryId || undefined,
    limit: 10,
  });
  const deleteProduct = useDeleteProduct();

  const categoryOptions = [
    { label: "All Categories", value: "" },
    ...(categories?.map((c) => ({ label: c.name, value: c.id })) ?? []),
  ];

  function resetPage() {
    setPage(1);
  }

  return (
    <AdminLayout title="Products">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-500">
          {data
            ? `${data.pagination.total} product${data.pagination.total !== 1 ? "s" : ""}`
            : ""}
        </p>
        <Link href="/admin/products/new">
          <Button variant="primary" size="sm">
            <Plus size={15} className="mr-1" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 my-5">
        <div className="flex-1">
          <SearchInput
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
        </div>
        <div className="sm:w-52">
          <Select
            options={categoryOptions}
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              resetPage();
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : !data || data.products.length === 0 ? (
        <EmptyState
          icon={<Package size={44} />}
          title={
            search || categoryId ? "No matching products" : "No products yet"
          }
          description={
            search || categoryId
              ? "Try adjusting your search or filter."
              : "Get started by adding your first product."
          }
          action={
            !search && !categoryId ? (
              <Link href="/admin/products/new">
                <Button variant="primary">Add Product</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Product</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Variants</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Discount</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.products.map((product) => {
                const images = parseProductImages(product.images);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100 ring-1 ring-black/5 shrink-0">
                          <Image
                            src={images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-900 whitespace-nowrap">
                          {product.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 whitespace-nowrap">
                      {product.category.name}
                    </TableCell>
                    <TableCell>{product.variantCount ?? 0}</TableCell>
                    <TableCell>
                      <ProductStatusToggle
                        productId={product.id}
                        status={product.status}
                        hasVariants={(product.variantCount ?? 0) > 0}
                      />
                    </TableCell>
                    <TableCell>
                      {product.discountPercentage ? (
                        <Badge variant="gold">
                          {product.discountPercentage}% OFF
                        </Badge>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setDiscountTarget(product)}
                          className="p-2 text-gray-400 cursor-pointer hover:text-gold transition-colors"
                          aria-label="Manage discount"
                        >
                          <Percent size={15} />
                        </button>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-gray-400 hover:text-brand transition-colors inline-block"
                          aria-label="Edit product"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="p-2 cursor-pointer text-gray-400 hover:text-error transition-colors"
                          aria-label="Delete product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="mt-5">
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <DiscountModal
        product={discountTarget}
        isOpen={!!discountTarget}
        onClose={() => setDiscountTarget(null)}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteProduct.mutate(deleteTarget.id, {
              onSuccess: () => setDeleteTarget(null),
            });
          }
        }}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This will also remove all its variants. This action cannot be undone.`}
        isPending={deleteProduct.isPending}
      />
    </AdminLayout>
  );
}
