import { useParams, Link, useNavigate } from "react-router-dom";
import { extendedProducts } from "@/lib/extendedMockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, ChevronLeft, Star, Truck, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = extendedProducts.find((p) => p.id === id);
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } =
    useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 pb-4"
        >
          <Link
            to={`/${product.category}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to {product.category}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 py-8">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Main Image */}
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary border border-border">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden bg-secondary border-2 cursor-pointer transition-all duration-300",
                    selectedImage === idx 
                      ? "border-primary ring-2 ring-primary/20" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {product.isNew && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    New Arrival
                  </Badge>
                )}
                {product.tags?.includes('sustainable') && (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Sustainable
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <p className="text-3xl font-semibold text-primary">
                  ${product.price}
                </p>
                {product.originalPrice && (
                  <p className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(128 reviews)</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">Over $100</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">2-Year Warranty</p>
                  <p className="text-xs text-muted-foreground">Quality Guaranteed</p>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Select Size</label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="lg"
                    className={cn(
                      "min-w-16 font-medium",
                      selectedSize === size && "ring-2 ring-primary/20"
                    )}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Select Color</label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="lg"
                    className={cn(
                      "min-w-20 font-medium",
                      selectedColor === color && "ring-2 ring-primary/20"
                    )}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={toggleWishlist}
                  className={cn(
                    "px-4",
                    inWishlist && "text-red-500 border-red-500 bg-red-50 hover:bg-red-100"
                  )}
                >
                  <Heart
                    className={cn("h-5 w-5", inWishlist && "fill-current")}
                  />
                </Button>
              </div>

              {/* Stock Info */}
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className={cn(
                  "h-4 w-4",
                  product.stock > 0 ? "text-green-500" : "text-red-500"
                )} />
                <span className={cn(
                  product.stock > 0 ? "text-green-600" : "text-red-600",
                  "font-medium"
                )}>
                  {product.stock > 10
                    ? "In Stock - Ready to Ship"
                    : product.stock > 0
                    ? `Only ${product.stock} left - Order soon`
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-border pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">SKU:</span> {product.id}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {product.category}
                </div>
                <div>
                  <span className="font-medium">Material:</span> {product.material || "Premium Cotton"}
                </div>
                <div>
                  <span className="font-medium">Care:</span> Machine Wash
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-24"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  You May Also Like
                </h2>
                <p className="text-muted-foreground mt-2">
                  Discover more from our {product.category} collection
                </p>
              </div>
              <Button variant="outline" asChild className="gap-2">
                <Link to={`/${product.category}`}>
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;