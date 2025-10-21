import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  const shipping = cartTotal > 0 ? 10 : 0;
  const total = cartTotal + shipping;

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
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Shopping Cart</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Your Cart
          </h1>
          <p className="text-muted-foreground text-lg">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-12 text-center border-border hover-lift">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/50 border border-border mb-6">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Your cart is empty
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                    Discover our curated collection and find something you'll love
                  </p>
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/">
                      Start Shopping
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <>
                {cart.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 border-border hover-lift group">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="w-28 h-28 rounded-xl bg-secondary overflow-hidden flex-shrink-0 border border-border">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="bg-secondary px-2 py-1 rounded-md">
                                  {item.selectedColor}
                                </span>
                                <span className="bg-secondary px-2 py-1 rounded-md">
                                  {item.selectedSize}
                                </span>
                              </div>
                            </div>
                            <p className="font-semibold text-lg">${item.price}</p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-lg border-border"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.selectedSize,
                                    item.selectedColor,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-12 text-center font-medium text-lg">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-lg border-border"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.selectedSize,
                                    item.selectedColor,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg gap-2"
                              onClick={() =>
                                removeFromCart(
                                  item.id,
                                  item.selectedSize,
                                  item.selectedColor
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </>
            )}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 border-border sticky top-24 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                {/* Coupon Section */}
                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Coupon Code</span>
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter code" 
                      className="bg-background border-input flex-1"
                    />
                    <Button variant="outline" className="shrink-0 border-input">
                      Apply
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                size="lg"
                className="w-full gap-2"
                asChild
                disabled={cart.length === 0}
              >
                <Link to="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              {/* Continue Shopping */}
              {cart.length > 0 && (
                <div className="mt-4 text-center">
                  <Button variant="ghost" asChild className="w-full">
                    <Link to="/">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
                  <div>
                    <div className="font-medium mb-1">Free Shipping</div>
                    <div>Over $100</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Easy Returns</div>
                    <div>30 Days</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Secure Checkout</div>
                    <div>SSL Protected</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
