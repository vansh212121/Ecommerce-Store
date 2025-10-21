import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { extendedProducts } from "@/lib/extendedMockData";
import { motion } from "framer-motion";
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

const CategoryPage = () => {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);

  const itemsPerPage = 12;

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

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">{categoryTitle}</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} products
          </p>
        </motion.div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <Card className="p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-6">Filters</h2>

              {/* Product Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Product Type</h3>
                <div className="space-y-2">
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
                        className="ml-2 text-sm cursor-pointer"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Colors</h3>
                <div className="space-y-2">
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
                        className="ml-2 text-sm cursor-pointer"
                      >
                        {color}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Sizes</h3>
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
                      className="w-12"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">
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

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedTypes([]);
                  setSelectedColors([]);
                  setSelectedSizes([]);
                  setPriceRange([0, 500]);
                  setCurrentPage(1);
                }}
              >
                Clear All Filters
              </Button>
            </Card>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex justify-end mb-6">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
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

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
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
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
