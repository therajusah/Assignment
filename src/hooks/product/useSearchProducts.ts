
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchProducts, ProductsResponse } from "@/services/api";

// Hook for searching products with pagination
export function useSearchProducts(query: string, pageSize: number = 24) {
  return useInfiniteQuery({
    queryKey: ['products', 'search', query, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      return await searchProducts(query, pageParam as number, pageSize);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.page_count) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
