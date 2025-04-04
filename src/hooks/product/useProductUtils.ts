
import { Product } from "@/services/api";
import { SortOption } from "@/components/Filters";

// Utility function to filter and sort products
export function filterAndSortProducts(
  products: Product[], 
  selectedCategories: string[],
  sugarRange: [number, number],
  sortOption: SortOption
): Product[] {
  // Filter by categories
  let filteredProducts = products;
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      const productCategories = product.categories_tags?.map(c => c.split(':').pop()) || [];
      return selectedCategories.some(cat => 
        productCategories.some(pCat => 
          pCat?.toLowerCase().includes(cat.toLowerCase())
        )
      );
    });
  }
  
  // Filter by sugar content
  filteredProducts = filteredProducts.filter(product => {
    const sugarContent = product.nutriments?.sugars_100g;
    if (sugarContent === undefined) return true; // Include products with unknown sugar content
    return sugarContent >= sugarRange[0] && sugarContent <= sugarRange[1];
  });
  
  // Sort products
  switch (sortOption) {
    case "name-asc":
      return [...filteredProducts].sort((a, b) => (a.product_name || "").localeCompare(b.product_name || ""));
    case "name-desc":
      return [...filteredProducts].sort((a, b) => (b.product_name || "").localeCompare(a.product_name || ""));
    case "grade-asc":
      return [...filteredProducts].sort((a, b) => {
        const gradeA = a.nutrition_grades?.toLowerCase() || "z";
        const gradeB = b.nutrition_grades?.toLowerCase() || "z";
        return gradeA.localeCompare(gradeB);
      });
    case "grade-desc":
      return [...filteredProducts].sort((a, b) => {
        const gradeA = a.nutrition_grades?.toLowerCase() || "z";
        const gradeB = b.nutrition_grades?.toLowerCase() || "z";
        return gradeB.localeCompare(gradeA);
      });
    case "calories-asc":
      return [...filteredProducts].sort((a, b) => {
        const caloriesA = a.nutriments?.energy_100g || 0;
        const caloriesB = b.nutriments?.energy_100g || 0;
        return caloriesA - caloriesB;
      });
    case "calories-desc":
      return [...filteredProducts].sort((a, b) => {
        const caloriesA = a.nutriments?.energy_100g || 0;
        const caloriesB = b.nutriments?.energy_100g || 0;
        return caloriesB - caloriesA;
      });
    default:
      return filteredProducts;
  }
}
