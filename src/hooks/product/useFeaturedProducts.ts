
import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "@/services/api";

// Hook for featured products
export function useFeaturedProducts(limit: number = 8, preferredCategory?: string) {
  const popularCategories = ["Snacks", "Beverages", "Dairy", "Breakfast cereals", "Fruits"];
  const categoryToUse = preferredCategory || popularCategories[Math.floor(Math.random() * popularCategories.length)];
  
  return useQuery({
    queryKey: ['featured-products', categoryToUse, limit],
    queryFn: async () => {
      // Fetch products from the category
      const response = await getProductsByCategory(categoryToUse, 1, limit);
      
      // Return the products
      return { 
        products: response.products.slice(0, limit),
        category: categoryToUse
      };
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
