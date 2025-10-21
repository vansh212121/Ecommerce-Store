import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockOrders } from "@/lib/mockData";
import { motion } from "framer-motion";
import { Package, ChevronRight, Calendar, DollarSign, Truck, CheckCircle, Clock, RefreshCw, ArrowRight } from "lucide-react";

const OrderHistory = () => {
  const getStatusConfig = (status) => {
    const configs = {
      delivered: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Delivered"
      },
      shipped: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Truck,
        label: "Shipped"
      },
      processing: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: RefreshCw,
        label: "Processing"
      },
      pending: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Clock,
        label: "Pending"
      },
    };
    return configs[status] || configs.pending;
  };

  const getStatusProgress = (status) => {
    const progress = {
      pending: 1,
      processing: 2,
      shipped: 3,
      delivered: 4
    };
    return progress[status] || 1;
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Package className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Order History</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Your Orders
          </h1>
          <p className="text-muted-foreground text-lg">
            Track and manage your purchases
          </p>
        </motion.div>

        {/* Order Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-4 text-center border-border bg-card/50">
            <div className="text-2xl font-bold text-foreground mb-1">
              {mockOrders.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Orders</div>
          </Card>
          <Card className="p-4 text-center border-border bg-card/50">
            <div className="text-2xl font-bold text-foreground mb-1">
              {mockOrders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-xs text-muted-foreground">Delivered</div>
          </Card>
          <Card className="p-4 text-center border-border bg-card/50">
            <div className="text-2xl font-bold text-foreground mb-1">
              {mockOrders.filter(o => o.status === 'shipped').length}
            </div>
            <div className="text-xs text-muted-foreground">In Transit</div>
          </Card>
          <Card className="p-4 text-center border-border bg-card/50">
            <div className="text-2xl font-bold text-foreground mb-1">
              ${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Spent</div>
          </Card>
        </motion.div>

        <div className="space-y-6">
          {mockOrders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            const progress = getStatusProgress(order.status);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 border-border hover-lift group">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <Badge className={`${statusConfig.color} border font-medium`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                  </div>

                  {/* Order Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                      <span className={progress >= 1 ? "text-foreground font-medium" : ""}>Ordered</span>
                      <span className={progress >= 2 ? "text-foreground font-medium" : ""}>Processing</span>
                      <span className={progress >= 3 ? "text-foreground font-medium" : ""}>Shipped</span>
                      <span className={progress >= 4 ? "text-foreground font-medium" : ""}>Delivered</span>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center flex-1">
                          <div className={`w-3 h-3 rounded-full ${
                            step <= progress 
                              ? step === 4 ? 'bg-green-500' : 'bg-primary'
                              : 'bg-border'
                          }`} />
                          {step < 4 && (
                            <div className={`flex-1 h-0.5 ${
                              step < progress 
                                ? step === 3 ? 'bg-green-500' : 'bg-primary'
                                : 'bg-border'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex gap-3 mb-6">
                    {order.items.slice(0, 3).map((item, itemIndex) => (
                      <div key={itemIndex} className="w-16 h-16 rounded-lg bg-secondary overflow-hidden border border-border flex-shrink-0">
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-16 h-16 rounded-lg bg-secondary border border-border flex items-center justify-center text-sm text-muted-foreground">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>View order details and tracking</span>
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary/10 transition-colors">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {mockOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Card className="p-12 max-w-md mx-auto border-border hover-lift">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/50 border border-border mb-6">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold mb-3">No orders yet</h2>
                <p className="text-muted-foreground mb-8">
                  Your order history will appear here once you make your first purchase
                </p>
                <Button asChild size="lg" className="gap-2">
                  <a href="/">
                    Start Shopping
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;