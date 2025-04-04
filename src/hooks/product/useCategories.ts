
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/api";

// Hook for getting all categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
