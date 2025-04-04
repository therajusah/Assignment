
import { Link } from "react-router-dom";
import { Product } from "@/services/api";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Function to determine nutrition grade class
  const getNutritionGradeClass = (grade: string | undefined) => {
    if (!grade) return "bg-gray-400";
    
    const gradeMap: Record<string, string> = {
      a: "nutrition-grade-a",
      b: "nutrition-grade-b",
      c: "nutrition-grade-c",
      d: "nutrition-grade-d",
      e: "nutrition-grade-e"
    };
    
    return gradeMap[grade.toLowerCase()] || "bg-gray-400";
  };

  // Format categories as a readable string
  const formatCategories = (categories: string) => {
    if (!categories) return "Uncategorized";
    
    return categories
      .split(",")
      .slice(0, 2)
      .map(cat => cat.trim())
      .join(", ");
  };

  // Truncate text to specific length
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Link to={`/product/${product.code}`} className="block">
      <div className="bg-card h-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
        <div className="relative h-48 bg-muted">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.product_name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          
          {product.nutrition_grades && (
            <div className="absolute top-2 right-2">
              <div className={cn("nutrition-grade", getNutritionGradeClass(product.nutrition_grades))}>
                {product.nutrition_grades.toUpperCase()}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">
            {product.product_name || "Unknown Product"}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-2">
            {formatCategories(product.categories)}
          </p>
          
          {product.ingredients_text && (
            <p className="text-sm mt-auto line-clamp-2 text-muted-foreground">
              {truncateText(product.ingredients_text, 100)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
