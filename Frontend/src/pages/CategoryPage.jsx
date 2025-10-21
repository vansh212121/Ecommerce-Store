import { useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { extendedProducts } from "@/lib/extendedMockData";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter, X, Grid3X3, List, Sparkles, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CategoryPage = () => {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(1); // Reset to first page when category changes
  }, [category]);

  const itemsPerPage = viewMode === "grid" ? 12 : 8;

  const productTypes = [
    "T-Shirts",
    "Shirts",
    "Pants",
    "Shorts",
    "Jackets",
    "Dresses",
    "Shoes",
  ];
  const availableColors = [
    "Black",
    "White",
    "Blue",
    "Navy",
    "Gray",
    "Beige",
    "Brown",
  ];
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const toggleFilter = (value, selected, setter) => {
    if (selected.includes(value)) {
      setter(selected.filter((v) => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const filteredProducts = useMemo(() => {
    let products =
      category === "new"
        ? extendedProducts.filter((p) => p.isNew)
        : extendedProducts.filter((p) => p.category === category);

    // Apply type filter
    if (selectedTypes.length > 0) {
      products = products.filter((p) =>
        selectedTypes.some((type) =>
          p.name.toLowerCase().includes(type.toLowerCase())
        )
      );
    }

    // Apply color filter
    if (selectedColors.length > 0) {
      products = products.filter((p) =>
        p.colors.some((color) => selectedColors.includes(color))
      );
    }

    // Apply size filter
    if (selectedSizes.length > 0) {
      products = products.filter((p) =>
        p.sizes.some((size) => selectedSizes.includes(size))
      );
    }

    // Apply price filter
    products = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort products
    if (sortBy === "price-low") {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      products = [...products].sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      products = [...products].sort(
        (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      );
    }

    return products;
  }, [
    category,
    selectedTypes,
    selectedColors,
    selectedSizes,
    priceRange,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categoryTitle =
    category === "new"
      ? "New Arrivals"
      : category?.charAt(0).toUpperCase() + category?.slice(1);

  const activeFiltersCount = selectedTypes.length + selectedColors.length + selectedSizes.length + (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([0, 500]);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 pb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{categoryTitle}</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {categoryTitle} Collection
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover {filteredProducts.length} premium products
              </p>
            </div>
            
            {/* Active Filters Badge */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Filter className="h-3 w-3" />
                  {activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}
                </Badge>
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8">
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-80 flex-shrink-0"
          >
            <Card className="p-6 border-border sticky top-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Filters</h2>
                </div>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Product Type Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Product Type
                </h3>
                <div className="space-y-3">
                  {productTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <Checkbox
                        id={type}
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() =>
                          toggleFilter(type, selectedTypes, setSelectedTypes)
                        }
                      />
                      <Label
                        htmlFor={type}
                        className="ml-3 text-sm cursor-pointer hover:text-foreground transition-colors"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4">Colors</h3>
                <div className="space-y-3">
                  {availableColors.map((color) => (
                    <div key={color} className="flex items-center">
                      <Checkbox
                        id={color}
                        checked={selectedColors.includes(color)}
                        onCheckedChange={() =>
                          toggleFilter(color, selectedColors, setSelectedColors)
                        }
                      />
                      <Label
                        htmlFor={color}
                        className="ml-3 text-sm cursor-pointer hover:text-foreground transition-colors"
                      >
                        {color}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <Button
                      key={size}
                      variant={
                        selectedSizes.includes(size) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        toggleFilter(size, selectedSizes, setSelectedSizes)
                      }
                      className="w-12 h-10 font-medium"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-4">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </h3>
                <Slider
                  min={0}
                  max={500}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$0</span>
                  <span>$500</span>
                </div>
              </div>
            </Card>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
            >
              {/* Mobile Filters Button */}
              <Button
                variant="outline"
                className="lg:hidden gap-2"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <div className="flex items-center gap-4 ml-auto">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-card border-border">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Products Grid/List */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "mb-8",
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                )}
              >
                {paginatedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard 
                      product={product} 
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <Card className="p-12 max-w-md mx-auto border-border hover-lift">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/50 border border-border mb-6">
                    <Filter className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters to see more results
                  </p>
                  <Button onClick={clearAllFilters} className="gap-2">
                    <X className="h-4 w-4" />
                    Clear All Filters
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer hover:bg-secondary"
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer hover:bg-secondary"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer hover:bg-secondary"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Filter Content - Same as desktop but with apply button */}
                <div className="space-y-8">
                  {/* Product Type Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-4">Product Type</h3>
                    <div className="space-y-3">
                      {productTypes.map((type) => (
                        <div key={type} className="flex items-center">
                          <Checkbox
                            id={`mobile-${type}`}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() =>
                              toggleFilter(type, selectedTypes, setSelectedTypes)
                            }
                          />
                          <Label
                            htmlFor={`mobile-${type}`}
                            className="ml-3 text-sm cursor-pointer"
                          >
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-4">Colors</h3>
                    <div className="space-y-3">
                      {availableColors.map((color) => (
                        <div key={color} className="flex items-center">
                          <Checkbox
                            id={`mobile-${color}`}
                            checked={selectedColors.includes(color)}
                            onCheckedChange={() =>
                              toggleFilter(color, selectedColors, setSelectedColors)
                            }
                          />
                          <Label
                            htmlFor={`mobile-${color}`}
                            className="ml-3 text-sm cursor-pointer"
                          >
                            {color}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Size Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-4">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <Button
                          key={size}
                          variant={
                            selectedSizes.includes(size) ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            toggleFilter(size, selectedSizes, setSelectedSizes)
                          }
                          className="w-12 h-10"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-4">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </h3>
                    <Slider
                      min={0}
                      max={500}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-2"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryPage;


