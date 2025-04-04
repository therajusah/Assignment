
import { useQuery } from "@tanstack/react-query";
import { getProductByBarcode, Product } from "@/services/api";

// Hook for getting product details by barcode
export function useProductDetails(barcode: string) {
  return useQuery({
    queryKey: ['product', barcode],
    queryFn: async () => {
      return await getProductByBarcode(barcode);
    },
    enabled: !!barcode,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
