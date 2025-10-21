import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Star, Eye, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/CartContext"
import { cn } from "@/lib/utils"

const ProductCard = ({ product, viewMode = "grid" }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist, addToCart } = useCart()
  const inWishlist = isInWishlist(product.id)

  const toggleWishlist = e => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, product.sizes[0], product.colors[0])
  }

  // For list view
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group"
      >
        <Link to={`/product/${product.id}`}>
          <div className="flex gap-4 p-4 rounded-xl border border-border hover-lift transition-all duration-300 group-hover:border-primary/20">
            {/* Product Image */}
            <div className="relative w-24 h-24 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {product.isNew && (
                <Badge className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0">
                  New
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors truncate">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                    {product.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xl font-bold text-primary">${product.price}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </p>
                  )}
                </div>
              </div>

              {/* Rating & Meta */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-3 w-3",
                        star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">(128)</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.slice(0, 3).map(color => (
                    <div
                      key={color}
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ 
                        backgroundColor: color.toLowerCase() === 'white' ? '#f8fafc' : 
                                       color.toLowerCase() === 'black' ? '#000000' : 
                                       color.toLowerCase() === 'blue' ? '#3b82f6' : 
                                       color.toLowerCase() === 'red' ? '#ef4444' : 
                                       color.toLowerCase() === 'green' ? '#10b981' : 
                                       color.toLowerCase() === 'gray' ? '#6b7280' : 
                                       color.toLowerCase() === 'beige' ? '#f5f5dc' : 
                                       color.toLowerCase() === 'navy' ? '#1e3a8a' : '#e5e7eb'
                      }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{product.colors.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-2 flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "px-3",
                    inWishlist && "text-red-500 border-red-500 bg-red-50 hover:bg-red-100"
                  )}
                  onClick={toggleWishlist}
                >
                  <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
                </Button>
                <Button variant="outline" size="sm" className="px-3">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // Default grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-xl bg-secondary mb-4 aspect-[3/4] border border-border group-hover:border-primary/20 transition-all duration-300">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground border-0 shadow-sm">
                <Zap className="h-3 w-3 mr-1" />
                New
              </Badge>
            )}
            {product.tags?.includes('sustainable') && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Sustainable
              </Badge>
            )}
            {product.stock <= 10 && product.stock > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                Low Stock
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "bg-background/90 backdrop-blur-sm hover:bg-background shadow-sm",
                inWishlist && "text-red-500 hover:text-red-600"
              )}
              onClick={toggleWishlist}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-background/90 backdrop-blur-sm hover:bg-background shadow-sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Add to Cart - Bottom Slide Up */}
          <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
            <Button 
              className="w-full gap-2" 
              size="sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Quick Add
            </Button>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
      </Link>

      <div className="space-y-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-primary">${product.price}</p>
            {product.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </p>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">4.8</span>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 flex-1">
            {product.colors.slice(0, 5).map(color => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-border shadow-sm"
                style={{ 
                  backgroundColor: color.toLowerCase() === 'white' ? '#f8fafc' : 
                                 color.toLowerCase() === 'black' ? '#000000' : 
                                 color.toLowerCase() === 'blue' ? '#3b82f6' : 
                                 color.toLowerCase() === 'red' ? '#ef4444' : 
                                 color.toLowerCase() === 'green' ? '#10b981' : 
                                 color.toLowerCase() === 'gray' ? '#6b7280' : 
                                 color.toLowerCase() === 'beige' ? '#f5f5dc' : 
                                 color.toLowerCase() === 'navy' ? '#1e3a8a' : '#e5e7eb'
                }}
                title={color}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
          
          {/* Size Indicator */}
          <div className="text-xs text-muted-foreground">
            {product.sizes.length} sizes
          </div>
        </div>

        {/* Stock Status */}
        {product.stock <= 10 && (
          <div className="flex items-center gap-1 text-xs">
            <div className={cn(
              "w-2 h-2 rounded-full",
              product.stock === 0 ? "bg-red-500" : 
              product.stock <= 5 ? "bg-orange-500" : "bg-yellow-500"
            )} />
            <span className={cn(
              product.stock === 0 ? "text-red-600" : 
              product.stock <= 5 ? "text-orange-600" : "text-yellow-600"
            )}>
              {product.stock === 0 ? "Out of stock" : 
               product.stock <= 5 ? `Only ${product.stock} left` : "Low stock"}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProductCard