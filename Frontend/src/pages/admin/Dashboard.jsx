import { Card } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, TrendingDown, MoreHorizontal, ArrowUpRight, Calendar, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      icon: DollarSign,
      change: "+12.5%",
      trend: "up",
      description: "From last month",
    },
    { 
      title: "Orders", 
      value: "324", 
      icon: ShoppingCart, 
      change: "+8.2%", 
      trend: "up",
      description: "24 pending" 
    },
    { 
      title: "Products", 
      value: "156", 
      icon: Package, 
      change: "+3", 
      trend: "up",
      description: "12 low stock" 
    },
    { 
      title: "Customers", 
      value: "1,248", 
      icon: Users, 
      change: "+15.3%", 
      trend: "up",
      description: "48 new today" 
    },
  ];

  const recentOrders = [
    { id: "ORD-1042", customer: "Alex Johnson", amount: "$124.99", status: "delivered", time: "2 min ago" },
    { id: "ORD-1041", customer: "Sarah Miller", amount: "$89.50", status: "shipped", time: "15 min ago" },
    { id: "ORD-1040", customer: "Mike Chen", amount: "$234.00", status: "processing", time: "1 hour ago" },
    { id: "ORD-1039", customer: "Emily Davis", amount: "$67.25", status: "delivered", time: "2 hours ago" },
    { id: "ORD-1038", customer: "James Wilson", amount: "$189.99", status: "shipped", time: "3 hours ago" },
  ];

  const topProducts = [
    { name: "Classic Cotton T-Shirt", sales: 142, revenue: "$2,845", growth: "+18%" },
    { name: "Slim Fit Jeans", sales: 98, revenue: "$4,410", growth: "+12%" },
    { name: "Wool Blend Sweater", sales: 76, revenue: "$3,800", growth: "+25%" },
    { name: "Leather Sneakers", sales: 63, revenue: "$4,725", growth: "+8%" },
  ];

  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-green-100 text-green-800 border-green-200",
      shipped: "bg-blue-100 text-blue-800 border-blue-200",
      processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
      pending: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Admin Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button className="gap-2">
            <Eye className="h-4 w-4" />
            View Reports
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 border-border hover-lift group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                    {stat.change}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-foreground mb-1">{stat.title}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 border-border hover-lift">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <p className="text-sm text-muted-foreground mt-1">Latest customer orders</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-sm">{order.amount}</p>
                      <p className="text-xs text-muted-foreground">{order.time}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-xs font-medium capitalize`}>
                      {order.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 border-border hover-lift">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Top Products</h2>
                <p className="text-sm text-muted-foreground mt-1">Best performing items</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {topProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{product.sales} sales</span>
                          <span className="text-xs font-medium text-green-600">{product.growth}</span>
                        </div>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">{product.revenue}</p>
                  </div>
                  
                  <Progress value={75 - (index * 15)} className="h-1" />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 border-border hover-lift">
          <h2 className="text-xl font-semibold mb-6">Store Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">94.2%</div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">$124.50</div>
              <div className="text-sm text-muted-foreground">Avg. Order Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">2.3</div>
              <div className="text-sm text-muted-foreground">Items per Order</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">12.4k</div>
              <div className="text-sm text-muted-foreground">Store Visits</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;