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
import { Plus, Pencil, Trash2, Tag, Palette, Ruler, MoreVertical, Grid3X3 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const ProductAttributes = () => {
  // Initial data - Fixed to not include 'value' for sizes
  const [productTypes, setProductTypes] = useState([
    { id: "1", name: "T-Shirts", productCount: 24, createdAt: "2025-01-15" },
    { id: "2", name: "Jeans", productCount: 18, createdAt: "2025-01-20" },
    { id: "3", name: "Shirts", productCount: 15, createdAt: "2025-02-01" },
    { id: "4", name: "Jackets", productCount: 12, createdAt: "2025-02-10" },
    { id: "5", name: "Dresses", productCount: 8, createdAt: "2025-02-15" },
  ]);

  const [colors, setColors] = useState([
    { id: "1", name: "Black", value: "#000000", productCount: 45, createdAt: "2025-01-15" },
    { id: "2", name: "White", value: "#FFFFFF", productCount: 38, createdAt: "2025-01-15" },
    { id: "3", name: "Navy Blue", value: "#000080", productCount: 22, createdAt: "2025-01-20" },
    { id: "4", name: "Charcoal Gray", value: "#36454F", productCount: 18, createdAt: "2025-02-01" },
    { id: "5", name: "Beige", value: "#F5F5DC", productCount: 12, createdAt: "2025-02-10" },
  ]);

  const [sizes, setSizes] = useState([
    { id: "1", name: "XS", productCount: 15, createdAt: "2025-01-15" },
    { id: "2", name: "S", productCount: 28, createdAt: "2025-01-15" },
    { id: "3", name: "M", productCount: 42, createdAt: "2025-01-15" },
    { id: "4", name: "L", productCount: 35, createdAt: "2025-01-15" },
    { id: "5", name: "XL", productCount: 20, createdAt: "2025-01-20" },
    { id: "6", name: "XXL", productCount: 8, createdAt: "2025-02-01" },
  ]);

  // State for modals
  const [activeTab, setActiveTab] = useState("types");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", value: "" });

  // Safe helper functions
  const getTabConfig = () => {
    const configs = {
      types: { title: "Product Types", singular: "Type", icon: Tag },
      colors: { title: "Colors", singular: "Color", icon: Palette },
      sizes: { title: "Sizes", singular: "Size", icon: Ruler },
    };
    return configs[activeTab] || { title: "Attributes", singular: "Attribute", icon: Grid3X3 };
  };

  const getTabIcon = () => {
    const config = getTabConfig();
    const IconComponent = config.icon;
    return <IconComponent className="h-5 w-5" />;
  };

  // Handlers
  const handleCreate = () => {
    const config = getTabConfig();
    const newItem = {
      id: Date.now().toString(),
      name: formData.name,
      productCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Only add value for colors
    if (activeTab === "colors") {
      newItem.value = formData.value;
    }

    if (activeTab === "types") {
      setProductTypes(prev => [...prev, newItem]);
    } else if (activeTab === "colors") {
      setColors(prev => [...prev, newItem]);
    } else if (activeTab === "sizes") {
      setSizes(prev => [...prev, newItem]);
    }

    setFormData({ name: "", value: "" });
    setIsCreateModalOpen(false);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({ 
      name: item.name, 
      value: item.value || "" // Handle cases where value doesn't exist
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    const updateData = (array) =>
      array.map(item =>
        item.id === selectedItem.id
          ? { 
              ...item, 
              name: formData.name,
              // Only update value for colors
              ...(activeTab === "colors" && { value: formData.value })
            }
          : item
      );

    if (activeTab === "types") {
      setProductTypes(updateData);
    } else if (activeTab === "colors") {
      setColors(updateData);
    } else if (activeTab === "sizes") {
      setSizes(updateData);
    }

    setFormData({ name: "", value: "" });
    setIsEditModalOpen(false);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const filterData = (array) => array.filter(item => item.id !== selectedItem.id);

    if (activeTab === "types") {
      setProductTypes(filterData);
    } else if (activeTab === "colors") {
      setColors(filterData);
    } else if (activeTab === "sizes") {
      setSizes(filterData);
    }

    setIsDeleteModalOpen(false);
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "types": return productTypes;
      case "colors": return colors;
      case "sizes": return sizes;
      default: return [];
    }
  };

  // Reset form when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setFormData({ name: "", value: "" });
  };

  const config = getTabConfig();
  const currentData = getCurrentData();

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
            <Grid3X3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Product Attributes</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Attributes Manager
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage product types, colors, and sizes for your catalog
          </p>
        </div>
        
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add {config.singular}
        </Button>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex border-b border-border"
      >
        {[
          { id: "types", label: "Product Types", icon: Tag, count: productTypes.length },
          { id: "colors", label: "Colors", icon: Palette, count: colors.length },
          { id: "sizes", label: "Sizes", icon: Ruler, count: sizes.length },
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              <TabIcon className="h-4 w-4" />
              {tab.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {tab.count}
              </Badge>
            </button>
          );
        })}
      </motion.div>

      {/* Content Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {currentData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className="p-6 border-border hover-lift group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getTabIcon()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    {activeTab === "colors" && item.value && (
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-4 h-4 rounded border border-border"
                          style={{ backgroundColor: item.value }}
                        />
                        <span className="text-sm text-muted-foreground font-mono">
                          {item.value}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.productCount} products
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(item)}
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

      {/* Empty State */}
      {currentData.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <Card className="p-12 max-w-md mx-auto border-border hover-lift">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/50 border border-border mb-6">
              {getTabIcon()}
            </div>
            <h3 className="text-xl font-semibold mb-3">No {config.title} Found</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first {config.singular.toLowerCase()}
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add {config.singular}
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Add New {config.singular}</DialogTitle>
                <DialogDescription>
                  Create a new {config.singular.toLowerCase()} for your products
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="create-name"
                placeholder={`Enter ${config.singular.toLowerCase()} name`}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-background border-input"
              />
            </div>
            {activeTab === "colors" && (
              <div className="space-y-2">
                <Label htmlFor="create-value" className="text-sm font-medium">
                  Color Value
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="create-value"
                    placeholder="#000000"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    className="bg-background border-input font-mono flex-1"
                  />
                  <div
                    className="w-12 h-10 rounded border border-border"
                    style={{ backgroundColor: formData.value || '#f3f4f6' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter a hex color code (e.g., #FF0000 for red)
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="gap-2" disabled={!formData.name}>
              <Plus className="h-4 w-4" />
              Add {config.singular}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Pencil className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Edit {config.singular}</DialogTitle>
                <DialogDescription>
                  Update {config.singular.toLowerCase()} information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-background border-input"
                />
              </div>
              {activeTab === "colors" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-value" className="text-sm font-medium">
                    Color Value
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="edit-value"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                      className="bg-background border-input font-mono flex-1"
                    />
                    <div
                      className="w-12 h-10 rounded border border-border"
                      style={{ backgroundColor: formData.value || '#f3f4f6' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} className="gap-2" disabled={!formData.name}>
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
                <DialogTitle>Delete {config.singular}</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
                  {selectedItem?.productCount > 0 && (
                    <span className="block mt-2 text-orange-600 font-medium">
                      Warning: This {config.singular.toLowerCase()} is used by {selectedItem.productCount} products.
                    </span>
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete {config.singular}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductAttributes;