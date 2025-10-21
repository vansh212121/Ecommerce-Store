import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  const shipping = cartTotal > 0 ? 10 : 0;
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Shopping Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground mb-6">
                  Add some items to get started
                </p>
                <Button asChild>
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </Card>
            ) : (
              <>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {item.selectedColor} / {item.selectedSize}
                              </p>
                            </div>
                            <p className="font-semibold">${item.price}</p>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
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
                              <span className="w-12 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
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
                              className="text-destructive"
                              onClick={() =>
                                removeFromCart(
                                  item.id,
                                  item.selectedSize,
                                  item.selectedColor
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
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
          >
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shipping}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Input placeholder="Coupon code" />
                <Button variant="outline" className="w-full">
                  Apply
                </Button>
              </div>

              <Button
                size="lg"
                className="w-full"
                asChild
                disabled={cart.length === 0}
              >
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
