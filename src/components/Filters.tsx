
import { useState } from "react";
import { Filter, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type SortOption = 
  | "name-asc"
  | "name-desc"
  | "grade-asc"
  | "grade-desc"
  | "calories-asc"
  | "calories-desc";

interface FiltersProps {
  onCategoryChange: (categories: string[]) => void;
  onSugarRangeChange: (range: [number, number]) => void;
  onSortChange: (sort: SortOption) => void;
  selectedCategories: string[];
  sugarRange: [number, number];
  sortOption: SortOption;
  availableCategories?: string[];
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "grade-asc", label: "Nutrition Grade (Best First)" },
  { value: "grade-desc", label: "Nutrition Grade (Worst First)" },
  { value: "calories-asc", label: "Calories (Low to High)" },
  { value: "calories-desc", label: "Calories (High to Low)" },
];

const Filters = ({ 
  onCategoryChange, 
  onSugarRangeChange, 
  onSortChange,
  selectedCategories,
  sugarRange,
  sortOption,
  availableCategories = []
}: FiltersProps) => {
  const [tempSugarRange, setTempSugarRange] = useState<[number, number]>(sugarRange);
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    onCategoryChange(updatedCategories);
  };

  const handleSugarRangeChange = (values: number[]) => {
    setTempSugarRange([values[0], values[1]]);
  };

  const applySugarRange = () => {
    onSugarRangeChange(tempSugarRange);
    setIsOpen(false);
  };

  const handleSortChange = (sort: SortOption) => {
    onSortChange(sort);
  };

  const getSortLabel = () => {
    return sortOptions.find(o => o.value === sortOption)?.label || "Sort";
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
      {/* Categories Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            Categories
            {selectedCategories.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedCategories.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Food Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-start space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Sugar Range Filter */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            Sugar {sugarRange[0]}g - {sugarRange[1]}g
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Sugar per 100g</h4>
            <div className="px-1">
              <Slider
                defaultValue={[tempSugarRange[0], tempSugarRange[1]]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleSugarRangeChange}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{tempSugarRange[0]}g</span>
                <span>{tempSugarRange[1]}g</span>
              </div>
            </div>
            <Button onClick={applySugarRange} className="w-full">
              Apply Filter
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Sort Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronDown size={16} />
            {getSortLabel()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={cn(
                "cursor-pointer flex items-center justify-between",
                sortOption === option.value && "font-medium"
              )}
            >
              {option.label}
              {sortOption === option.value && <Check size={16} />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Filters;
