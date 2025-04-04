
import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, Barcode, Star, Info, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { SortOption } from "@/components/Filters";
import { useFeaturedProducts } from "@/hooks/useProductQueries";
import { ProductGridSkeleton } from "@/components/ui/Loader";

const FoodCategories = [
  { name: "Beverages", icon: "🥤" },
  { name: "Dairy", icon: "🥛" },
  { name: "Snacks", icon: "🍪" },
  { name: "Fruits", icon: "🍎" },
  { name: "Vegetables", icon: "🥦" },
  { name: "Meat", icon: "🥩" },
  { name: "Fish", icon: "🐟" }
];

const featuredGrades = [
  { grade: "A", description: "Very good nutritional quality" },
  { grade: "B", description: "Good nutritional quality" },
  { grade: "C", description: "Average nutritional quality" },
  { grade: "D", description: "Poor nutritional quality" },
  { grade: "E", description: "Bad nutritional quality" }
];

const Index = () => {
  const [selectedCategories] = useState<string[]>([]);
  const [sugarRange] = useState<[number, number]>([0, 100]);
  const [sortOption] = useState<SortOption>("name-asc");
  
  // Use the new featured products hook
  const { data: featuredData, isLoading: isFeaturedLoading, isError } = useFeaturedProducts(8);

  return (
    <Layout>
      <section className="mb-12">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl overflow-hidden mb-12">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Discover Better Food Choices
              </h1>
              <p className="text-white/90 text-lg mb-8">
                Explore thousands of food products, check nutritional information, and make healthier choices for you and your family.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-white text-green-600 hover:bg-white/90 hover:text-green-700">
                  <Link to="/search">
                    <Search className="mr-2 h-5 w-5" />
                    Search Products
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-black hover:bg-white/10 dark:text-white">
                  <Link to="/barcode">
                    <Barcode className="mr-2 h-5 w-5" />
                    Scan Barcode
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Food Category Section */}
        <div className="container mx-auto mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <Button variant="ghost" asChild>
              <Link to="/search" className="flex items-center text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {FoodCategories.map((category) => (
              <Link 
                to={`/search?category=${category.name}`} 
                key={category.name} 
                className="no-underline"
              >
                <Card className="hover:shadow-md transition-shadow duration-300 group h-full flex flex-col justify-center">
                  <CardContent className="flex flex-col items-center py-6 text-center">
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">{category.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Nutrition Score Guide */}
        <div className="container mx-auto mb-16 bg-muted rounded-2xl p-6 md:p-10">
          <div className="flex items-center gap-2 mb-6">
            <Info className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Understanding Nutri-Score</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {featuredGrades.map((item) => (
              <Card key={item.grade} className="bg-card overflow-hidden">
                <div className="p-3 flex flex-col items-center text-center">
                  <div className={`nutrition-grade nutrition-grade-${item.grade.toLowerCase()} w-12 h-12 text-2xl mb-2`}>
                    {item.grade}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Featured Products */}
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 text-amber-500" />
            <h2 className="text-2xl font-bold">Featured Products</h2>
            {featuredData?.category && (
              <span className="text-sm text-muted-foreground ml-2">
                from {featuredData.category}
              </span>
            )}
          </div>
          
          {isFeaturedLoading ? (
            <ProductGridSkeleton />
          ) : isError ? (
            <p className="text-center text-muted-foreground py-12">
              Failed to load featured products. Please try again.
            </p>
          ) : featuredData?.products && featuredData.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredData.products.map((product) => (
                <ProductCard key={product.code} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No featured products available.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
