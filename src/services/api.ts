

const API_BASE_URL = "https://world.openfoodfacts.org";


export interface Product {
  id: string;
  code: string;
  product_name: string;
  image_url: string;
  image_small_url: string;
  image_front_url: string;
  categories: string;
  categories_tags: string[];
  ingredients_text: string;
  nutrition_grades: string;
  nutriments: {
    energy_100g: number;
    fat_100g: number;
    carbohydrates_100g: number;
    proteins_100g: number;
    salt_100g: number;
    sugars_100g: number;
    [key: string]: number;
  };
  labels: string;
  labels_tags: string[];
  brands: string;
  quantity: string;
  serving_quantity: string;
}

export interface ProductsResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: Product[];
  skip: number;
}

export interface CategoryResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: Product[];
  skip: number;
  tags: Array<{ id: string; name: string; products: number }>;
}

// Get products by search term
export const searchProducts = async (query: string, page: number = 1, pageSize: number = 24): Promise<ProductsResponse> => {
  const url = `${API_BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}&json=true`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to search products: ${response.statusText}`);
  }
  
  return await response.json();
};

// Get products by category
export const getProductsByCategory = async (category: string, page: number = 1, pageSize: number = 24): Promise<CategoryResponse> => {
  const url = `${API_BASE_URL}/category/${encodeURIComponent(category)}.json?page=${page}&page_size=${pageSize}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to get products by category: ${response.statusText}`);
  }
  
  return await response.json();
};

// Get product by barcode
export const getProductByBarcode = async (barcode: string): Promise<{ product: Product, status: number }> => {
  const url = `${API_BASE_URL}/api/v0/product/${barcode}.json`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to get product by barcode: ${response.statusText}`);
  }
  
  return await response.json();
};

// Get all categories
export const getCategories = async (): Promise<string[]> => {
  return [
    "Beverages",
    "Dairy",
    "Snacks",
    "Breakfast cereals",
    "Breads",
    "Frozen foods",
    "Canned foods",
    "Confectionery",
    "Fruits",
    "Vegetables",
    "Meat",
    "Fish",
    "Plant-based foods"
  ];
};
