
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton loader for product cards
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md">
      <Skeleton className="h-48 w-full" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <div className="flex justify-between items-center mt-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </div>
  );
};

// Skeleton grid for product listings
export const ProductGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(8).fill(0).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Skeleton for product details
export const ProductDetailsSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="h-80 w-full md:w-1/3 rounded-lg" />
        
        <div className="w-full md:w-2/3">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-6 w-1/3 mb-6" />
          
          <div className="mb-6">
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="flex justify-between items-center">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-1/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
