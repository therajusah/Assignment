
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductsByCategory, CategoryResponse } from "@/services/api";

// Hook for products by category with pagination
export function useCategoryProducts(category: string, pageSize: number = 24) {
  return useInfiniteQuery({
    queryKey: ['products', 'category', category, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      return await getProductsByCategory(category, pageParam as number, pageSize);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.page_count) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: !!category,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
