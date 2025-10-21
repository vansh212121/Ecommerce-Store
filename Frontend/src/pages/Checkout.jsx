import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { CreditCard, Truck, Lock, Shield, ArrowRight, MapPin, BadgeCheck } from "lucide-react";

const Checkout = () => {
  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Secure Checkout</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete your purchase with confidence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center gap-8 mb-2"
            >
              {['Cart', 'Information', 'Payment', 'Confirmation'].map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === 1 
                      ? 'bg-primary text-primary-foreground' 
                      : index < 1 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${
                    index === 1 ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step}
                  </span>
                  {index < 3 && (
                    <div className="w-6 h-px bg-border hidden sm:block" />
                  )}
                </div>
              ))}
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 border-border hover-lift">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                    <Input id="firstName" className="bg-background border-input" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                    <Input id="lastName" className="bg-background border-input" required />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                    <Input id="email" type="email" className="bg-background border-input" required />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">Street Address *</Label>
                    <Input id="address" className="bg-background border-input" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                    <Input id="city" className="bg-background border-input" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="text-sm font-medium">ZIP Code *</Label>
                    <Input id="zip" className="bg-background border-input" required />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 border-border hover-lift">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                
                <RadioGroup defaultValue="card" className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span>Credit / Debit Card</span>
                        <div className="flex gap-2">
                          <div className="w-8 h-5 bg-muted rounded-sm" />
                          <div className="w-8 h-5 bg-muted rounded-sm" />
                          <div className="w-8 h-5 bg-muted rounded-sm" />
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span>PayPal</span>
                        <div className="w-12 h-7 bg-blue-500 rounded-sm" />
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number *</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      className="bg-background border-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-sm font-medium">Expiry Date *</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        className="bg-background border-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-sm font-medium">CVV *</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        className="bg-background border-input"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 border-border sticky top-24 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>

              {/* Order Items Preview */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-primary/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">Classic Cotton T-Shirt</p>
                    <p className="text-xs text-muted-foreground">Size: M • Qty: 1</p>
                  </div>
                  <p className="font-semibold text-sm">$45.00</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-primary/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">Slim Fit Jeans</p>
                    <p className="text-xs text-muted-foreground">Size: 32 • Qty: 1</p>
                  </div>
                  <p className="font-semibold text-sm">$45.00</p>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal (2 items)</span>
                  <span className="font-medium">$90.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">$10.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">$8.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>$108.00</span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button size="lg" className="w-full gap-2 mb-4">
                <Lock className="h-4 w-4" />
                Place Order
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Security Badges */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Secure SSL Encryption</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <BadgeCheck className="h-4 w-4 text-green-500" />
                  <span>30-Day Money Back Guarantee</span>
                </div>
              </div>

              {/* Trust Features */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-center text-xs text-muted-foreground">
                  <div>
                    <div className="font-medium mb-1">Free Returns</div>
                    <div>30 Days</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Customer Support</div>
                    <div>24/7 Help</div>
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

export default Checkout;