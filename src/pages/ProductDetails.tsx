import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductByBarcode, Product } from "@/services/api";
import Layout from "@/components/Layout/Layout";
import { ProductDetailsSkeleton } from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, AlertCircle, Info, Star, Check, X, ShieldAlert, Calendar, Globe, Leaf, HeartPulse, ArrowRight, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useSimilarProducts } from "@/hooks/useProductQueries";
import ProductCard from "@/components/ProductCard";

const ProductDetails = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isIngredientsExpanded, setIsIngredientsExpanded] = useState(false);
  const { toast } = useToast();

  const { data: similarProductsData, isLoading: loadingSimilar } = useSimilarProducts(
    product?.categories || "",
    barcode || "",
    4
  );

  useEffect(() => {
    if (!barcode) {
      setError("No barcode provided");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductByBarcode(barcode);
        
        if (response.status === 0) {
          setError("Product not found");
          toast({
            title: "Product Not Found",
            description: `No product found with barcode: ${barcode}`,
            variant: "destructive",
          });
        } else {
          setProduct(response.product);
        }
      } catch (err) {
        setError("Failed to load product");
        toast({
          title: "Error",
          description: "Failed to fetch product details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcode, toast]);

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

  const formatLabels = (labels: string | undefined): string[] => {
    if (!labels) return [];
    return labels.split(',').map(label => label.trim());
  };

  const getNutrientLevel = (value: number | undefined, type: string): { level: string, percentage: number } => {
    if (value === undefined) return { level: 'unknown', percentage: 0 };
    
    const thresholds = {
      fat: { low: 3, high: 20 },
      saturated: { low: 1.5, high: 5 },
      sugars: { low: 5, high: 12.5 },
      salt: { low: 0.3, high: 1.5 }
    };
    
    const threshold = thresholds[type as keyof typeof thresholds] || { low: 0, high: 100 };
    
    let level = 'moderate';
    if (value <= threshold.low) level = 'low';
    if (value >= threshold.high) level = 'high';
    
    const percentage = Math.min(100, Math.max(0, (value / threshold.high) * 100));
    
    return { level, percentage };
  };
  
  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'low': return 'bg-nutrition-grade-a';
      case 'moderate': return 'bg-nutrition-grade-c';
      case 'high': return 'bg-nutrition-grade-e';
      default: return 'bg-gray-300';
    }
  };

  if (loading) {
    return (
      <Layout>
        <ProductDetailsSkeleton />
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center rounded-full bg-muted p-6 mb-4">
            <AlertCircle size={32} className="text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{error || "An error occurred"}</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the product you're looking for.
          </p>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto pb-12">
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link to="/">
              <ArrowLeft size={16} className="mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
        
        <div className="bg-card rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-lg overflow-hidden shadow-sm mb-4"
              >
                {product.image_front_url ? (
                  <img 
                    src={product.image_front_url} 
                    alt={product.product_name} 
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No Image Available</span>
                  </div>
                )}
              </motion.div>
              
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {product.brands && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Brand</h3>
                      <p>{product.brands}</p>
                    </div>
                  )}
                  
                  {product.quantity && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Quantity</h3>
                      <p>{product.quantity}</p>
                    </div>
                  )}
                  
                  {product.code && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Barcode</h3>
                      <p className="font-mono text-xs">{product.code}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {product.nutrition_grades && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Nutri-Score</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-4">
                    <div className={`nutrition-grade ${getNutritionGradeClass(product.nutrition_grades)} w-24 h-24 text-4xl mb-4`}>
                      {product.nutrition_grades.toUpperCase()}
                    </div>
                    <p className="text-center text-muted-foreground text-sm">
                      {product.nutrition_grades.toLowerCase() === 'a' && "Excellent nutritional quality"}
                      {product.nutrition_grades.toLowerCase() === 'b' && "Good nutritional quality"}
                      {product.nutrition_grades.toLowerCase() === 'c' && "Average nutritional quality"}
                      {product.nutrition_grades.toLowerCase() === 'd' && "Poor nutritional quality"}
                      {product.nutrition_grades.toLowerCase() === 'e' && "Unhealthy nutritional quality"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.product_name || "Unknown Product"}</h1>
                  
                  {product.categories && (
                    <p className="text-muted-foreground">{product.categories}</p>
                  )}
                </div>
                
                <Tabs defaultValue="summary" className="mb-6">
                  <TabsList className="w-full border-b justify-start rounded-none bg-transparent p-0 mb-6">
                    <TabsTrigger value="summary" className="rounded-t-lg data-[state=active]:bg-background data-[state=active]:shadow">
                      Summary
                    </TabsTrigger>
                    <TabsTrigger value="nutrition" className="rounded-t-lg data-[state=active]:bg-background data-[state=active]:shadow">
                      Nutrition
                    </TabsTrigger>
                    <TabsTrigger value="ingredients" className="rounded-t-lg data-[state=active]:bg-background data-[state=active]:shadow">
                      Ingredients
                    </TabsTrigger>
                    <TabsTrigger value="environment" className="rounded-t-lg data-[state=active]:bg-background data-[state=active]:shadow">
                      Sustainability
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary">
                    <Card>
                      <CardHeader>
                        <CardTitle>Nutritional Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                          {product.nutriments && (
                            <>
                              <div>
                                <h3 className="font-medium mb-2">Fat</h3>
                                <div className="flex justify-between mb-2">
                                  <span>{product.nutriments.fat_100g?.toFixed(1) || "?"} g per 100g</span>
                                  <span className={`capitalize font-medium text-sm px-2 py-1 rounded-full ${
                                    getNutrientLevel(product.nutriments.fat_100g, 'fat').level === 'low' ? 'bg-green-100 text-green-800' : 
                                    getNutrientLevel(product.nutriments.fat_100g, 'fat').level === 'high' ? 'bg-red-100 text-red-800' : 
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {getNutrientLevel(product.nutriments.fat_100g, 'fat').level}
                                  </span>
                                </div>
                                <Progress 
                                  value={getNutrientLevel(product.nutriments.fat_100g, 'fat').percentage} 
                                  className={`h-2 ${getLevelColor(getNutrientLevel(product.nutriments.fat_100g, 'fat').level)}`} 
                                />
                              </div>
                              
                              <div>
                                <h3 className="font-medium mb-2">Saturated Fat</h3>
                                <div className="flex justify-between mb-2">
                                  <span>{product.nutriments["saturated-fat_100g"]?.toFixed(1) || "?"} g per 100g</span>
                                  <span className={`capitalize font-medium text-sm px-2 py-1 rounded-full ${
                                    getNutrientLevel(product.nutriments["saturated-fat_100g"], 'saturated').level === 'low' ? 'bg-green-100 text-green-800' : 
                                    getNutrientLevel(product.nutriments["saturated-fat_100g"], 'saturated').level === 'high' ? 'bg-red-100 text-red-800' : 
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {getNutrientLevel(product.nutriments["saturated-fat_100g"], 'saturated').level}
                                  </span>
                                </div>
                                <Progress 
                                  value={getNutrientLevel(product.nutriments["saturated-fat_100g"], 'saturated').percentage} 
                                  className={`h-2 ${getLevelColor(getNutrientLevel(product.nutriments["saturated-fat_100g"], 'saturated').level)}`} 
                                />
                              </div>
                              
                              <div>
                                <h3 className="font-medium mb-2">Sugars</h3>
                                <div className="flex justify-between mb-2">
                                  <span>{product.nutriments.sugars_100g?.toFixed(1) || "?"} g per 100g</span>
                                  <span className={`capitalize font-medium text-sm px-2 py-1 rounded-full ${
                                    getNutrientLevel(product.nutriments.sugars_100g, 'sugars').level === 'low' ? 'bg-green-100 text-green-800' : 
                                    getNutrientLevel(product.nutriments.sugars_100g, 'sugars').level === 'high' ? 'bg-red-100 text-red-800' : 
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {getNutrientLevel(product.nutriments.sugars_100g, 'sugars').level}
                                  </span>
                                </div>
                                <Progress 
                                  value={getNutrientLevel(product.nutriments.sugars_100g, 'sugars').percentage} 
                                  className={`h-2 ${getLevelColor(getNutrientLevel(product.nutriments.sugars_100g, 'sugars').level)}`} 
                                />
                              </div>
                              
                              <div>
                                <h3 className="font-medium mb-2">Salt</h3>
                                <div className="flex justify-between mb-2">
                                  <span>{product.nutriments.salt_100g?.toFixed(2) || "?"} g per 100g</span>
                                  <span className={`capitalize font-medium text-sm px-2 py-1 rounded-full ${
                                    getNutrientLevel(product.nutriments.salt_100g, 'salt').level === 'low' ? 'bg-green-100 text-green-800' : 
                                    getNutrientLevel(product.nutriments.salt_100g, 'salt').level === 'high' ? 'bg-red-100 text-red-800' : 
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {getNutrientLevel(product.nutriments.salt_100g, 'salt').level}
                                  </span>
                                </div>
                                <Progress 
                                  value={getNutrientLevel(product.nutriments.salt_100g, 'salt').percentage} 
                                  className={`h-2 ${getLevelColor(getNutrientLevel(product.nutriments.salt_100g, 'salt').level)}`} 
                                />
                              </div>
                            </>
                          )}
                        </div>
                        
                        {product.labels && (
                          <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-4">Labels</h2>
                            <div className="flex flex-wrap gap-2">
                              {formatLabels(product.labels).map((label, index) => (
                                <Badge key={index} variant="outline" className="px-3 py-1 text-sm rounded-full">
                                  <Leaf className="mr-1 h-3 w-3" />
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="nutrition">
                    <Card>
                      <CardHeader>
                        <CardTitle>Nutrition Facts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-6">
                          <h2 className="text-lg font-bold mb-4 pb-2 border-b">Nutrition Facts (per 100g)</h2>
                          {product.nutriments ? (
                            <div className="divide-y">
                              <div className="py-3 grid grid-cols-2">
                                <h3 className="font-medium">Energy</h3>
                                <p className="text-right">{product.nutriments.energy_100g || "N/A"} kcal</p>
                              </div>
                              <div className="py-3 grid grid-cols-2">
                                <h3 className="font-medium">Fat</h3>
                                <p className="text-right">{product.nutriments.fat_100g?.toFixed(1) || "N/A"}g</p>
                              </div>
                              <div className="py-3 grid grid-cols-2 pl-4">
                                <h3 className="font-medium text-sm">Saturated Fat</h3>
                                <p className="text-right">{product.nutriments["saturated-fat_100g"]?.toFixed(1) || "N/A"}g</p>
                              </div>
                              <div className="py-3 grid grid-cols-2">
                                <h3 className="font-medium">Carbohydrates</h3>
                                <p className="text-right">{product.nutriments.carbohydrates_100g?.toFixed(1) || "N/A"}g</p>
                              </div>
                              <div className="py-3 grid grid-cols-2 pl-4">
                                <h3 className="font-medium text-sm">Sugars</h3>
                                <p className="text-right">{product.nutriments.sugars_100g?.toFixed(1) || "N/A"}g</p>
                              </div>
                              <div className="py-3 grid grid-cols-2">
                                <h3 className="font-medium">Fiber</h3>
                                <p className="text-right">{product.nutriments.fiber_100g?.toFixed(1) || "N/A"}g</p>
                              </div>
                              <div className="py-3 grid grid-cols-2">
                                <h3 className="font-medium">Protein</h3>
                                <p className="text-right">{product.nutriments.proteins_100g?.toFixed(1) || "N/A"}g</p>
                              </div>
                              <div className="py-3 grid grid-cols-2">
                                <h3 className="font-medium">Salt</h3>
                                <p className="text-right">{product.nutriments.salt_100g?.toFixed(2) || "N/A"}g</p>
                              </div>
                              <div className="py-3 grid grid-cols-2">
                                <h3 className="font-medium">Sodium</h3>
                                <p className="text-right">{product.nutriments.sodium_100g?.toFixed(2) || "N/A"}g</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No nutritional information available</p>
                          )}
                        </div>
                        
                        {product.serving_quantity && (
                          <div className="mb-6">
                            <h3 className="font-medium mb-2">Serving Information</h3>
                            <p>Serving size: {product.serving_quantity}</p>
                          </div>
                        )}
                        
                        <div className="mb-6">
                          <h3 className="font-medium mb-2">How does this fit into your daily diet?</h3>
                          <p className="text-sm text-muted-foreground">
                            The values above show the amount of nutrients per 100g of the product. To understand how this fits into your daily needs, remember that an average adult should consume approximately:
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                            <li>2000-2500 calories per day</li>
                            <li>Less than 70g of fat</li>
                            <li>Less than 20g of saturated fat</li>
                            <li>Less than 50g of added sugar</li>
                            <li>Less than 6g of salt</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="ingredients">
                    <Card>
                      <CardHeader>
                        <CardTitle>Ingredients List</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {product.ingredients_text ? (
                          <Collapsible 
                            open={isIngredientsExpanded} 
                            onOpenChange={setIsIngredientsExpanded}
                            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6"
                          >
                            <div className="text-sm mb-4">
                              {isIngredientsExpanded ? (
                                <ScrollArea className="h-64">
                                  <p className="whitespace-pre-wrap">{product.ingredients_text}</p>
                                </ScrollArea>
                              ) : (
                                <p className="line-clamp-2">{product.ingredients_text}</p>
                              )}
                            </div>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="w-full border-t pt-2 flex justify-center">
                                {isIngredientsExpanded ? "Show Less" : "Show More"}
                              </Button>
                            </CollapsibleTrigger>
                          </Collapsible>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No ingredients information available</p>
                        )}
                        
                        <div className="mt-6">
                          <h3 className="font-medium mb-2">Allergen Information</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                              <span className="text-muted-foreground">Gluten</span>
                              {product.ingredients_text?.toLowerCase().includes('gluten') || product.ingredients_text?.toLowerCase().includes('wheat') ? (
                                <Badge variant="destructive" className="ml-auto"><X size={12} className="mr-1" /> Contains</Badge>
                              ) : (
                                <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200"><Check size={12} className="mr-1" /> Not detected</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                              <span className="text-muted-foreground">Milk</span>
                              {product.ingredients_text?.toLowerCase().includes('milk') || product.ingredients_text?.toLowerCase().includes('dairy') ? (
                                <Badge variant="destructive" className="ml-auto"><X size={12} className="mr-1" /> Contains</Badge>
                              ) : (
                                <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200"><Check size={12} className="mr-1" /> Not detected</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                              <span className="text-muted-foreground">Eggs</span>
                              {product.ingredients_text?.toLowerCase().includes('egg') ? (
                                <Badge variant="destructive" className="ml-auto"><X size={12} className="mr-1" /> Contains</Badge>
                              ) : (
                                <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200"><Check size={12} className="mr-1" /> Not detected</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                              <span className="text-muted-foreground">Nuts</span>
                              {product.ingredients_text?.toLowerCase().includes('nut') ? (
                                <Badge variant="destructive" className="ml-auto"><X size={12} className="mr-1" /> Contains</Badge>
                              ) : (
                                <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200"><Check size={12} className="mr-1" /> Not detected</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                              <span className="text-muted-foreground">Soy</span>
                              {product.ingredients_text?.toLowerCase().includes('soy') ? (
                                <Badge variant="destructive" className="ml-auto"><X size={12} className="mr-1" /> Contains</Badge>
                              ) : (
                                <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200"><Check size={12} className="mr-1" /> Not detected</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            <ShieldAlert className="inline h-3 w-3 mr-1" /> 
                            This information is automatically detected and may not be 100% accurate. Always check the product packaging.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="environment">
                    <Card>
                      <CardHeader>
                        <CardTitle>Environmental Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                            <div className="flex items-center gap-2 mb-4">
                              <Leaf className="h-5 w-5 text-primary" />
                              <h3 className="font-semibold">Packaging</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              Information about the product packaging and its recyclability.
                            </p>
                            <div className="space-y-2">
                              {product.labels?.toLowerCase().includes('recycl') ? (
                                <div className="flex gap-2 items-center">
                                  <Check className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">Recyclable packaging</span>
                                </div>
                              ) : (
                                <div className="flex gap-2 items-center">
                                  <Info className="h-4 w-4 text-amber-600" />
                                  <span className="text-sm">No recycling information available</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                            <div className="flex items-center gap-2 mb-4">
                              <Globe className="h-5 w-5 text-primary" />
                              <h3 className="font-semibold">Origin</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {product.categories?.includes("Organic") ? 
                                "This product is labeled as organic, which typically means it was produced without synthetic pesticides and fertilizers." : 
                                "No specific origin information available for this product."}
                            </p>
                            
                            {product.labels?.toLowerCase().includes('organ') && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                                <Leaf className="mr-1 h-3 w-3" /> Organic
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                          <div className="flex items-center gap-2 mb-4">
                            <HeartPulse className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Health & Environment Impact</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                              <h4 className="font-medium mb-2 text-sm">Additives</h4>
                              <p className="text-sm text-muted-foreground">
                                {product.ingredients_text?.toLowerCase().includes('e') && 
                                  /e\d{3}/i.test(product.ingredients_text?.toLowerCase()) ? 
                                  "Contains E-number additives." : 
                                  "No detected additives."}
                              </p>
                            </div>
                            
                            <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                              <h4 className="font-medium mb-2 text-sm">Palm Oil</h4>
                              <p className="text-sm text-muted-foreground">
                                {product.ingredients_text?.toLowerCase().includes('palm') ? 
                                  "Contains palm oil or derivatives." : 
                                  "No palm oil detected in ingredients."}
                              </p>
                            </div>
                            
                            <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                              <h4 className="font-medium mb-2 text-sm">Processing</h4>
                              <p className="text-sm text-muted-foreground">
                                {product.ingredients_text && product.ingredients_text.length > 200 ? 
                                  "Likely a highly processed food (many ingredients)." : 
                                  "Appears to be minimally processed based on ingredient count."}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-4">
                            <Info className="inline h-3 w-3 mr-1" /> 
                            Environmental impact information is estimated based on available product data and may not be comprehensive.
                          </p>
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="font-medium mb-4">Environmental Claims</h3>
                          <div className="flex flex-wrap gap-2">
                            {product.labels && formatLabels(product.labels).map((label, index) => {
                              if (
                                label.toLowerCase().includes('organic') || 
                                label.toLowerCase().includes('eco') || 
                                label.toLowerCase().includes('sustain') ||
                                label.toLowerCase().includes('recycl') ||
                                label.toLowerCase().includes('bio') ||
                                label.toLowerCase().includes('fair') ||
                                label.toLowerCase().includes('green')
                              ) {
                                return (
                                  <Badge key={index} variant="outline" className="px-3 py-1 text-sm rounded-full bg-green-50 border-green-200 text-green-700">
                                    <Check className="mr-1 h-3 w-3" />
                                    {label}
                                  </Badge>
                                );
                              }
                              return null;
                            })}
                            {!product.labels || !formatLabels(product.labels).some(label => 
                              label.toLowerCase().includes('organic') || 
                              label.toLowerCase().includes('eco') || 
                              label.toLowerCase().includes('sustain') ||
                              label.toLowerCase().includes('recycl') ||
                              label.toLowerCase().includes('bio') ||
                              label.toLowerCase().includes('fair') ||
                              label.toLowerCase().includes('green')
                            ) && (
                              <p className="text-sm text-muted-foreground italic">No environmental claims detected</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Product Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Barcode</h3>
                  <p className="font-mono">{product.code}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Brands</h3>
                  <p>{product.brands || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Quantity</h3>
                  <p>{product.quantity || "Unspecified"}</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div>
                  <h3 className="font-medium">Data quality</h3>
                  <p className="text-sm text-muted-foreground">
                    Information is sourced from OpenFoodFacts and may be incomplete.
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://world.openfoodfacts.org/product/${product.code}`} target="_blank" rel="noreferrer">
                    View on OpenFoodFacts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-amber-500" />
            Similar Products
          </h2>
          
          {loadingSimilar ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <CardContent className="pt-4">
                    <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-muted rounded mb-2 w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : similarProductsData && similarProductsData.products.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                Compare with similar products in the {product.categories?.split(',')[0]} category.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {similarProductsData.products.map((similarProduct) => (
                  <ProductCard key={similarProduct.code} product={similarProduct} />
                ))}
              </div>
              <div className="text-center mt-6">
                <Button variant="outline" asChild>
                  <Link to={`/search?query=${encodeURIComponent(product.categories?.split(',')[0] || '')}`}>
                    Browse More Similar Products
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-10 bg-muted/30 rounded-lg">
              <Info className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No similar products found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any similar products in the same category.
              </p>
              <Button variant="outline" asChild>
                <Link to="/">
                  Browse All Products
                </Link>
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
