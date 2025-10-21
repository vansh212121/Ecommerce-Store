import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { extendedProducts } from "@/lib/extendedMockData";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Search = () => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "denim",
    "sweater",
    "boots",
  ]);

  const filteredProducts = query.trim()
    ? extendedProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      setRecentSearches((prev) => [searchTerm, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Search</h1>

          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-12 h-12 text-lg"
              autoFocus
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">
                Recent Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Results */}
        {query && (
          <div>
            <p className="text-muted-foreground mb-6">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "result" : "results"} for "
              {query}"
            </p>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found</p>
                <p className="text-sm text-muted-foreground">
                  Try searching for something else
                </p>
              </div>
            )}
          </div>
        )}

        {/* Popular Categories */}
        {!query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["men", "women", "unisex", "new"].map((cat) => (
                <Button
                  key={cat}
                  variant="outline"
                  className="h-20 capitalize"
                  onClick={() => (window.location.href = `/${cat}`)}
                >
                  {cat === "new" ? "New Arrivals" : cat}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;
