import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X, Clock, TrendingUp, Sparkles, Filter } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { extendedProducts } from "@/lib/extendedMockData";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Search = () => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "denim jeans", "wool sweater", "leather boots", "cotton t-shirt", "winter coat"
  ]);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = query.trim()
    ? extendedProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Apply additional filters
  const finalProducts = activeFilter === "all" 
    ? filteredProducts 
    : filteredProducts.filter(p => p.category === activeFilter);

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      setRecentSearches((prev) => [searchTerm, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setActiveFilter("all");
  };

  const removeRecentSearch = (termToRemove) => {
    setRecentSearches(prev => prev.filter(term => term !== termToRemove));
  };

  const popularCategories = [
    { name: "men", label: "Men's Collection", count: extendedProducts.filter(p => p.category === 'men').length },
    { name: "women", label: "Women's Collection", count: extendedProducts.filter(p => p.category === 'women').length },
    { name: "unisex", label: "Unisex Styles", count: extendedProducts.filter(p => p.category === 'unisex').length },
    { name: "new", label: "New Arrivals", count: extendedProducts.filter(p => p.tags?.includes('new')).length },
  ];

  const trendingSearches = ["minimalist", "sustainable", "organic cotton", "premium"];

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <SearchIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Search</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Discover Your Style
            </h1>
            <p className="text-muted-foreground text-lg">
              Find exactly what you're looking for
            </p>
          </div>

          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for products, categories, or styles..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg border-border bg-card rounded-xl"
              autoFocus
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-8"
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Recent Searches</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <Badge
                    key={term}
                    variant="secondary"
                    className="px-3 py-1.5 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors group"
                    onClick={() => handleSearch(term)}
                  >
                    {term}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(term);
                      }}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Trending Searches */}
          {!query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Trending Now</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <Badge
                    key={term}
                    variant="outline"
                    className="px-3 py-1.5 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                    onClick={() => handleSearch(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto"
            >
              {/* Results Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <p className="text-muted-foreground">
                    Found <span className="font-semibold text-foreground">{finalProducts.length}</span>{" "}
                    {finalProducts.length === 1 ? "product" : "products"} for "
                    <span className="font-semibold text-foreground">{query}</span>"
                  </p>
                </div>
                
                {/* Filter Options */}
                {filteredProducts.length > 0 && (
                  <div className="flex items-center gap-3">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <div className="flex gap-1 bg-secondary rounded-lg p-1">
                      {["all", "men", "women", "unisex"].map((filter) => (
                        <Button
                          key={filter}
                          variant={activeFilter === filter ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setActiveFilter(filter)}
                          className="capitalize text-xs"
                        >
                          {filter === "all" ? "All" : filter}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Grid */}
              {finalProducts.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                >
                  {finalProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <Card className="p-12 max-w-md mx-auto border-border hover-lift">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/50 border border-border mb-6">
                      <SearchIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      We couldn't find any products matching "{query}". Try adjusting your search terms.
                    </p>
                    <div className="space-y-3">
                      <Button onClick={clearSearch} className="w-full gap-2">
                        Clear Search
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <a href="/collections">Browse All Products</a>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popular Categories - Show when no search */}
        {!query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mt-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Explore Collections</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card 
                    className="p-6 border-border hover-lift cursor-pointer group"
                    onClick={() => (window.location.href = `/${category.name}`)}
                  >
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {category.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count} products
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;


