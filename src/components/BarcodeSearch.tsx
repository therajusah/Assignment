
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Barcode, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const BarcodeSearch = () => {
  const [barcode, setBarcode] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!barcode.trim()) {
      toast({
        title: "Enter a barcode",
        description: "Please enter a valid barcode to search",
        variant: "destructive",
      });
      return;
    }
    
    // Check if barcode is numeric
    if (!/^\d+$/.test(barcode)) {
      toast({
        title: "Invalid barcode format",
        description: "Barcode should contain only numbers",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to product page
    navigate(`/product/${barcode}`);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="bg-food-green p-3 rounded-full mb-4">
          <Barcode size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Barcode Search</h2>
        <p className="text-muted-foreground">
          Enter a product barcode to find detailed information
        </p>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter barcode number (e.g., 737628064502)"
            className="pl-10"
          />
          <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        </div>
        
        <Button type="submit" className="w-full">
          <Search className="mr-2" size={16} />
          Search Product
        </Button>
      </form>
    </div>
  );
};

export default BarcodeSearch;
