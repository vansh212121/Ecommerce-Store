import { Link } from "react-router-dom"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/CartContext"
import { cn } from "@/lib/utils"

const ProductCard = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useCart()
  const inWishlist = isInWishlist(product.id)

  const toggleWishlist = e => {
    e.preventDefault()
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-lg bg-secondary mb-3 aspect-[3/4]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.isNew && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              New
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background",
              inWishlist && "text-red-500 hover:text-red-600"
            )}
            onClick={toggleWishlist}
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
          </Button>
        </div>
      </Link>

      <div className="space-y-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">${product.price}</p>
        <div className="flex gap-1 mt-2">
          {product.colors.slice(0, 4).map(color => (
            <div
              key={color}
              className="w-4 h-4 rounded-full border border-border bg-secondary"
              title={color}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
