import { Skeleton } from "@/src/components/ui/Skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-8">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
