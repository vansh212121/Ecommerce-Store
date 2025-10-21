import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Tag, Zap, Calendar, Users, TrendingUp, MoreVertical, Eye, Copy } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const Promotions = () => {
  const [promotions] = useState([
    {
      id: "1",
      code: "WELCOME10",
      discount: 10,
      type: "percentage",
      active: true,
      expiresAt: "2025-12-31",
      usage: { used: 45, max: 1000 },
      createdAt: "2025-01-15",
    },
    {
      id: "2",
      code: "FREESHIP",
      discount: 0,
      type: "shipping",
      active: true,
      expiresAt: "2025-11-30",
      usage: { used: 128, max: 500 },
      createdAt: "2025-02-01",
    },
    {
      id: "3",
      code: "FALL25",
      discount: 25,
      type: "percentage",
      active: false,
      expiresAt: "2025-10-31",
      usage: { used: 89, max: 200 },
      createdAt: "2025-09-01",
    },
    {
      id: "4",
      code: "SAVE15",
      discount: 15,
      type: "percentage",
      active: true,
      expiresAt: "2025-12-25",
      usage: { used: 234, max: 1000 },
      createdAt: "2025-03-10",
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  const handleEdit = (promo) => {
    setSelectedPromo(promo);
    setIsEditModalOpen(true);
  };

  const handleDelete = (promo) => {
    setSelectedPromo(promo);
    setIsDeleteModalOpen(true);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  const getDiscountText = (promo) => {
    if (promo.type === "percentage") return `${promo.discount}% off`;
    if (promo.type === "shipping") return "Free shipping";
    return `$${promo.discount} off`;
  };

  const getUsagePercentage = (promo) => {
    return (promo.usage.used / promo.usage.max) * 100;
  };

  const activePromotions = promotions.filter(p => p.active);
  const inactivePromotions = promotions.filter(p => !p.active);

  const promotionStats = {
    total: promotions.length,
    active: activePromotions.length,
    totalUsage: promotions.reduce((sum, p) => sum + p.usage.used, 0),
    expiringSoon: promotions.filter(p => {
      const expires = new Date(p.expiresAt);
      const today = new Date();
      const diffTime = expires - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && p.active;
    }).length,
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
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Promotion Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Promotions
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage discount codes and special offers to drive sales
          </p>
        </div>
        
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Promotion
        </Button>
      </motion.div>

      {/* Promotion Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="p-6 border-border hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Promotions</p>
              <p className="text-2xl font-bold">{promotionStats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Tag className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-border hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Now</p>
              <p className="text-2xl font-bold text-green-600">{promotionStats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-border hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Uses</p>
              <p className="text-2xl font-bold">{promotionStats.totalUsage}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-border hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">{promotionStats.expiringSoon}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex border-b border-border"
      >
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "active"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Promotions ({activePromotions.length})
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "inactive"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("inactive")}
        >
          Inactive Promotions ({inactivePromotions.length})
        </button>
      </motion.div>

      {/* Active Promotions */}
      {activeTab === "active" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {activePromotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="p-6 border-border hover-lift group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-semibold text-lg bg-secondary px-2 py-1 rounded">
                          {promo.code}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(promo.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {getDiscountText(promo)}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Active
                  </Badge>
                </div>

                {/* Usage Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="font-medium">
                      {promo.usage.used} / {promo.usage.max}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getUsagePercentage(promo)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Expires {new Date(promo.expiresAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Created {new Date(promo.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(promo)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(promo)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Inactive Promotions */}
      {activeTab === "inactive" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr className="text-left">
                    <th className="p-4 font-semibold text-sm">Promo Code</th>
                    <th className="p-4 font-semibold text-sm">Discount</th>
                    <th className="p-4 font-semibold text-sm">Usage</th>
                    <th className="p-4 font-semibold text-sm">Expired</th>
                    <th className="p-4 font-semibold text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inactivePromotions.map((promo, index) => (
                    <motion.tr
                      key={promo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{promo.code}</span>
                          <Badge variant="outline" className="text-xs">
                            Expired
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-sm">
                        {getDiscountText(promo)}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {promo.usage.used} uses
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(promo.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Reactivate
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDelete(promo)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Create Promotion Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Create New Promotion</DialogTitle>
                <DialogDescription>
                  Add a new discount code or special offer to drive sales
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="create-code" className="text-sm font-medium">Promo Code</Label>
                <Input id="create-code" placeholder="SUMMER2025" className="bg-background border-input font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-type" className="text-sm font-medium">Discount Type</Label>
                <Select defaultValue="percentage">
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="create-discount" className="text-sm font-medium">Discount Value</Label>
                <Input id="create-discount" type="number" placeholder="15" className="bg-background border-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-expires" className="text-sm font-medium">Expires At</Label>
                <Input id="create-expires" type="date" className="bg-background border-input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="create-max-uses" className="text-sm font-medium">Maximum Uses</Label>
                <Input id="create-max-uses" type="number" placeholder="1000" className="bg-background border-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-min-order" className="text-sm font-medium">Minimum Order</Label>
                <Input id="create-min-order" type="number" placeholder="0" className="bg-background border-input" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsCreateModalOpen(false)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Promotion Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Pencil className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Edit Promotion</DialogTitle>
                <DialogDescription>Update promotion details and settings</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {selectedPromo && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-code" className="text-sm font-medium">Promo Code</Label>
                  <Input id="edit-code" defaultValue={selectedPromo.code} className="bg-background border-input font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type" className="text-sm font-medium">Discount Type</Label>
                  <Select defaultValue={selectedPromo.type}>
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-discount" className="text-sm font-medium">Discount Value</Label>
                  <Input
                    id="edit-discount"
                    type="number"
                    defaultValue={selectedPromo.discount}
                    className="bg-background border-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expires" className="text-sm font-medium">Expires At</Label>
                  <Input
                    id="edit-expires"
                    type="date"
                    defaultValue={selectedPromo.expiresAt}
                    className="bg-background border-input"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditModalOpen(false)} className="gap-2">
              <Pencil className="h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle>Delete Promotion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the promotion code "
                  {selectedPromo?.code}"? This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(false)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Promotions;
