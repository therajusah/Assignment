import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { Product } from "@/services/api";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./ui/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SortOption } from "./Filters";
import { 
  useSearchProducts,
  useCategoryProducts,
  filterAndSortProducts
} from "@/hooks/product";

interface ProductListProps {
  searchQuery?: string;
  selectedCategories: string[];
  sugarRange: [number, number];
  sortOption: SortOption;
}

const ProductList = ({
  searchQuery = "",
  selectedCategories,
  sugarRange,
  sortOption,
}: ProductListProps) => {
  const { toast } = useToast();
  
  // Set up infinite queries
  const {
    data: searchData,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasMoreSearchResults,
    isFetchingNextPage: isFetchingNextSearchPage,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError
  } = useSearchProducts(searchQuery, 24);
  
  const defaultCategory = selectedCategories.length > 0 ? selectedCategories[0] : "Snacks";
  const {
    data: categoryData,
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasMoreCategoryResults,
    isFetchingNextPage: isFetchingNextCategoryPage,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError
  } = useCategoryProducts(defaultCategory, 24);
  
  // Use intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  
  // Load more products when the bottom is visible
  useEffect(() => {
    if (inView) {
      if (searchQuery && hasMoreSearchResults && !isFetchingNextSearchPage) {
        fetchNextSearchPage();
      } else if (!searchQuery && hasMoreCategoryResults && !isFetchingNextCategoryPage) {
        fetchNextCategoryPage();
      }
    }
  }, [
    inView, 
    searchQuery, 
    hasMoreSearchResults, 
    isFetchingNextSearchPage, 
    hasMoreCategoryResults, 
    isFetchingNextCategoryPage,
    fetchNextSearchPage,
    fetchNextCategoryPage
  ]);
  
  // Extract all products from paginated results
  const products = useMemo(() => {
    let allProducts: Product[] = [];
    
    if (searchQuery && searchData) {
      searchData.pages.forEach(page => {
        allProducts = [...allProducts, ...page.products];
      });
    } else if (categoryData) {
      categoryData.pages.forEach(page => {
        allProducts = [...allProducts, ...page.products];
      });
    }
    
    // Apply filters and sorting
    return filterAndSortProducts(allProducts, selectedCategories, sugarRange, sortOption);
  }, [searchData, categoryData, searchQuery, selectedCategories, sugarRange, sortOption]);
  
  // Handle errors
  useEffect(() => {
    if (isSearchError && searchError) {
      toast({
        title: "Error",
        description: `Failed to search products: ${searchError instanceof Error ? searchError.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
    
    if (isCategoryError && categoryError) {
      toast({
        title: "Error",
        description: `Failed to fetch category products: ${categoryError instanceof Error ? categoryError.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  }, [isSearchError, isCategoryError, searchError, categoryError, toast]);
  
  // Determine loading and error states
  const isLoading = (searchQuery && isSearchLoading) || (!searchQuery && isCategoryLoading);
  const isFetchingNext = (searchQuery && isFetchingNextSearchPage) || (!searchQuery && isFetchingNextCategoryPage);
  const hasMoreResults = (searchQuery && hasMoreSearchResults) || (!searchQuery && hasMoreCategoryResults);
  
  // Handle error states
  if ((searchQuery && isSearchError) || (!searchQuery && isCategoryError)) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">
          Unable to connect to the food database.
        </p>
        <p className="text-muted-foreground mb-6">
          Try searching for a specific product to see results.
        </p>
      </div>
    );
  }
  
  // Handle empty results
  if (!isLoading && products.length === 0) {
    if (!searchQuery) {
      return (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Enter a search term to find products</p>
          <p className="text-muted-foreground">
            Search for foods like "chocolate", "pasta", or "orange juice"
          </p>
        </div>
      );
    }
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.code} product={product} />
        ))}
      </div>
      
      {(isLoading || isFetchingNext) && <ProductGridSkeleton />}
      
      {!isLoading && hasMoreResults && (
        <div ref={ref} className="py-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => {
              if (searchQuery) {
                fetchNextSearchPage();
              } else {
                fetchNextCategoryPage();
              }
            }}
          >
            Load More
          </Button>
        </div>
      )}
      
      {!isLoading && !hasMoreResults && products.length > 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No more products to load.
        </p>
      )}
    </div>
  );
};

export default ProductList;
