import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockOrders } from "@/lib/mockData";
import { motion } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";

const OrderHistory = () => {
  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-green-100 text-green-800",
      shipped: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      pending: "bg-gray-100 text-gray-800",
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </motion.div>

        <div className="space-y-4">
          {mockOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">Order {order.id}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on{" "}
                      {new Date(order.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>View Details</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}

          {mockOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground">
                Your order history will appear here
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
