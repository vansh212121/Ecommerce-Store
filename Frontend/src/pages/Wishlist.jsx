import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const { wishlist } = useCart();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Wishlist</h1>
          <p className="text-muted-foreground">{wishlist.length} saved items</p>
        </motion.div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Save items you love to keep track of them
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
