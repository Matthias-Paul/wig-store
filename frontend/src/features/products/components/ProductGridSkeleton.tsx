import { Skeleton } from "@/src/components/ui/Skeleton";

interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
  return (
    <>
      <div className="grid grid-cols-1 cursor-pointer w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-full shadow-sm rounded-sm pb-3 space-y-3 ">
            <Skeleton className="h-90 md:h-65 w-full" />
            <div className="mx-4 space-y-3">
              <Skeleton className="h-3 w-2/4" />
              <Skeleton className="h-2 w-1/3" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
