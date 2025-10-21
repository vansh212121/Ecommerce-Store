import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist } = useCart();

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Wishlist</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Your Wishlist
              </h1>
              <p className="text-muted-foreground text-lg">
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "saved item" : "saved items"}
              </p>
            </div>
            {wishlist.length > 0 && (
              <Button asChild variant="outline" className="gap-2">
                <Link to="/">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </motion.div>

        {wishlist.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Collection Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 text-center border-border bg-card/50">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {wishlist.length}
                </div>
                <div className="text-xs text-muted-foreground">Total Items</div>
              </Card>
              <Card className="p-4 text-center border-border bg-card/50">
                <div className="text-2xl font-bold text-foreground mb-1">
                  ${Math.max(...wishlist.map((p) => p.price))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Highest Price
                </div>
              </Card>
              <Card className="p-4 text-center border-border bg-card/50">
                <div className="text-2xl font-bold text-foreground mb-1">
                  ${Math.min(...wishlist.map((p) => p.price))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Lowest Price
                </div>
              </Card>
              <Card className="p-4 text-center border-border bg-card/50">
                <div className="text-2xl font-bold text-foreground mb-1">
                  $
                  {wishlist
                    .reduce((sum, product) => sum + product.price, 0)
                    .toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">Total Value</div>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <Card className="p-6 border-border bg-card">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Ready to make them yours?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Move your favorite items to cart
                      </p>
                    </div>
                  </div>
                  <Button asChild className="gap-2">
                    <Link to="/">
                      Shop Collection
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Card className="p-12 max-w-md mx-auto border-border hover-lift">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/50 border border-border mb-6">
                <Heart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-8">
                Save items you love to keep track of them and create your
                perfect collection
              </p>
              <div className="space-y-3">
                <Button asChild size="lg" className="gap-2 w-full">
                  <Link to="/">
                    Explore Products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/collections">View Collections</Link>
                </Button>
              </div>
            </Card>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto"
            >
              <Card className="p-6 text-center border-border bg-card/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Save Favorites</h3>
                <p className="text-sm text-muted-foreground">
                  Keep track of items you love for later
                </p>
              </Card>
              <Card className="p-6 text-center border-border bg-card/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Get Notified</h3>
                <p className="text-sm text-muted-foreground">
                  Alerts for price drops and restocks
                </p>
              </Card>
              <Card className="p-6 text-center border-border bg-card/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Easy Access</h3>
                <p className="text-sm text-muted-foreground">
                  Quick checkout when you're ready
                </p>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
