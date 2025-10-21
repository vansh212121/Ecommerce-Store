import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

const Checkout = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" />
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <RadioGroup defaultValue="card">
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit / Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
              </RadioGroup>

              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>$90</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>$10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$8</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>$108</span>
                </div>
              </div>

              <Button size="lg" className="w-full">
                Place Order
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
