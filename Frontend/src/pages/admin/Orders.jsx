import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, Search, Filter, Download, MoreVertical, Calendar, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const Orders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const itemsPerPage = 10;

  const allOrders = [
    {
      id: "ORD-1042",
      customer: "Alex Johnson",
      email: "alex.johnson@email.com",
      total: 156.99,
      status: "delivered",
      date: "2025-10-15",
      items: 3,
      payment: "paid",
    },
    {
      id: "ORD-1041",
      customer: "Sarah Miller",
      email: "sarah.m@email.com",
      total: 234.50,
      status: "shipped",
      date: "2025-10-18",
      items: 2,
      payment: "paid",
    },
    {
      id: "ORD-1040",
      customer: "Mike Chen",
      email: "mike.chen@email.com",
      total: 89.00,
      status: "processing",
      date: "2025-10-19",
      items: 1,
      payment: "paid",
    },
    {
      id: "ORD-1039",
      customer: "Alice Brown",
      email: "alice.b@email.com",
      total: 445.25,
      status: "pending",
      date: "2025-10-20",
      items: 4,
      payment: "pending",
    },
    {
      id: "ORD-1038",
      customer: "Charlie Davis",
      email: "charlie.d@email.com",
      total: 312.75,
      status: "delivered",
      date: "2025-10-14",
      items: 2,
      payment: "paid",
    },
    {
      id: "ORD-1037",
      customer: "Diana Evans",
      email: "diana.e@email.com",
      total: 178.00,
      status: "shipped",
      date: "2025-10-17",
      items: 3,
      payment: "paid",
    },
    {
      id: "ORD-1036",
      customer: "Frank Miller",
      email: "frank.m@email.com",
      total: 267.80,
      status: "processing",
      date: "2025-10-19",
      items: 2,
      payment: "paid",
    },
    {
      id: "ORD-1035",
      customer: "Grace Wilson",
      email: "grace.w@email.com",
      total: 523.40,
      status: "pending",
      date: "2025-10-21",
      items: 5,
      payment: "pending",
    },
    {
      id: "ORD-1034",
      customer: "Henry Moore",
      email: "henry.m@email.com",
      total: 145.99,
      status: "delivered",
      date: "2025-10-13",
      items: 1,
      payment: "paid",
    },
    {
      id: "ORD-1033",
      customer: "Ivy Taylor",
      email: "ivy.t@email.com",
      total: 398.20,
      status: "shipped",
      date: "2025-10-16",
      items: 3,
      payment: "paid",
    },
  ];

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesDate = dateFilter === "all" || true; // Add date filtering logic

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusConfig = (status) => {
    const configs = {
      delivered: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      shipped: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Truck,
      },
      processing: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Package,
      },
      pending: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Clock,
      },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatus = (payment) => {
    return payment === "paid" 
      ? "bg-green-100 text-green-800 border-green-200" 
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const stats = {
    total: allOrders.length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
    pending: allOrders.filter(o => o.status === 'pending').length,
    revenue: allOrders.reduce((sum, order) => sum + order.total, 0),
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
            <Package className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Order Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Orders
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage and track all customer orders
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Create Order
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <Card className="p-6 border-border hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-border hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-border hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-border hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Revenue</p>
              <p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 border-border hover-lift">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders, customers, or emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-input"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-background border-input">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-background border-input">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr className="text-left">
                  <th className="p-4 font-semibold text-sm">Order</th>
                  <th className="p-4 font-semibold text-sm">Customer</th>
                  <th className="p-4 font-semibold text-sm">Date</th>
                  <th className="p-4 font-semibold text-sm">Total</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                  <th className="p-4 font-semibold text-sm">Payment</th>
                  <th className="p-4 font-semibold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order, index) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors group"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-sm">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.items} items</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {order.date}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-sm">${order.total.toFixed(2)}</p>
                      </td>
                      <td className="p-4">
                        <Badge className={`${statusConfig.color} border text-xs font-medium capitalize gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getPaymentStatus(order.payment)} border text-xs font-medium capitalize`}>
                          {order.payment}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select defaultValue={order.status}>
                            <SelectTrigger className="w-32 bg-background border-input text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </p>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:bg-secondary"
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer hover:bg-secondary"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:bg-secondary"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}
    </div>
  );
};

export default Orders;