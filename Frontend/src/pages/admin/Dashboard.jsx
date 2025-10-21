import { Card } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231",
      icon: DollarSign,
      change: "+12.5%",
    },
    { title: "Orders", value: "324", icon: ShoppingCart, change: "+8.2%" },
    { title: "Products", value: "156", icon: Package, change: "+3" },
    { title: "Customers", value: "1,248", icon: Users, change: "+15.3%" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your store overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="font-medium">Order #ORD-{1000 + i}</p>
                <p className="text-sm text-muted-foreground">Customer Name</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${(Math.random() * 200 + 50).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Just now</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
