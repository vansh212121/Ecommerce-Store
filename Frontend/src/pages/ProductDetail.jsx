import { useParams, Link } from "react-router-dom";
import { extendedProducts } from "@/lib/extendedMockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams();
  const product = extendedProducts.find((p) => p.id === id);
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } =
    useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  if (!product) return <div>Product not found</div>;

  const relatedProducts = extendedProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      return;
    }
    addToCart(product, selectedSize, selectedColor);
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to={`/${product.category}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to {product.category}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-secondary">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-lg overflow-hidden bg-secondary cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              {product.isNew && <Badge className="mb-3">New Arrival</Badge>}
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary">
                ${product.price}
              </p>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Size Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={toggleWishlist}
                className={cn(inWishlist && "text-red-500 border-red-500")}
              >
                <Heart
                  className={cn("h-4 w-4", inWishlist && "fill-current")}
                />
              </Button>
            </div>

            {/* Stock Info */}
            <p className="text-sm text-muted-foreground">
              {product.stock > 10
                ? "In Stock"
                : `Only ${product.stock} left in stock`}
            </p>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
