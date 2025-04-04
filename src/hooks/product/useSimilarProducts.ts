
import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "@/services/api";

// Hook for getting similar products
export function useSimilarProducts(category: string, currentProductCode: string, limit: number = 4) {
  return useQuery({
    queryKey: ['similar-products', category, currentProductCode, limit],
    queryFn: async () => {
      if (!category) return { products: [] };
      
      // Get the main category (first one)
      const mainCategory = category.split(',')[0].trim();
      
      // Get products from this category
      const response = await getProductsByCategory(mainCategory, 1, limit + 5);
      
      // Filter out the current product and limit results
      const filteredProducts = response.products
        .filter(product => product.code !== currentProductCode)
        .slice(0, limit);
      
      return { products: filteredProducts };
    },
    enabled: !!category && !!currentProductCode,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
