
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import SearchBar from "@/components/SearchBar";
import ProductList from "@/components/ProductList";
import Filters, { SortOption } from "@/components/Filters";
import { useCategories, useFeaturedProducts } from "@/hooks/product";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sugarRange, setSugarRange] = useState<[number, number]>([0, 100]);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  
  // Get categories data with React Query
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Get similar products when a category is selected
  const currentCategory = selectedCategories.length > 0 ? selectedCategories[0] : "";
  const { data: similarProducts, isLoading: isSimilarLoading } = useFeaturedProducts(4, currentCategory);

  // Extract search query from URL on component mount or URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    const category = params.get("category");
    
    setSearchQuery(query);
    
    if (category) {
      setSelectedCategories([category]);
    }
  }, [location.search]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Update URL to reflect the search
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    
    navigate({
      pathname: "/search",
      search: params.toString(),
    });
  };

  return (
    <Layout>
      <section>
        <div className="max-w-2xl mx-auto mb-6 text-center">
          <h1 className="text-3xl font-bold mb-3">Search Food Products</h1>
          <p className="text-muted-foreground">
            Find detailed information about any food product
          </p>
        </div>
        
        <div className="max-w-xl mx-auto mb-8">
          <SearchBar 
            onSearch={handleSearch}
            initialQuery={searchQuery}
          />
        </div>
        
        {categoriesLoading ? (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <Filters
              selectedCategories={selectedCategories}
              sugarRange={sugarRange}
              sortOption={sortOption}
              onCategoryChange={setSelectedCategories}
              onSugarRangeChange={setSugarRange}
              onSortChange={setSortOption}
              availableCategories={categories}
            />
            
            <ProductList 
              searchQuery={searchQuery}
              selectedCategories={selectedCategories}
              sugarRange={sugarRange}
              sortOption={sortOption}
            />
            
            {/* Similar products section - show when a category is selected */}
            {selectedCategories.length > 0 && similarProducts && similarProducts.products && similarProducts.products.length > 0 && (
              <div className="mt-12 border-t pt-8">
                <h2 className="text-2xl font-bold mb-6">
                  More products from {currentCategory}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {isSimilarLoading ? (
                    <div className="flex justify-center col-span-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : similarProducts.products.map((product) => (
                    <ProductCard key={product.code} product={product} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
};

export default Search;
