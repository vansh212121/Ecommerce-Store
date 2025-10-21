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
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useState } from "react";

const Promotions = () => {
  const [promotions] = useState([
    {
      id: "1",
      code: "WELCOME10",
      discount: 10,
      type: "percentage",
      active: true,
      expiresAt: "2025-12-31",
    },
    {
      id: "2",
      code: "FREESHIP",
      discount: 0,
      type: "fixed",
      active: true,
      expiresAt: "2025-11-30",
    },
    {
      id: "3",
      code: "FALL25",
      discount: 25,
      type: "percentage",
      active: false,
      expiresAt: "2025-10-31",
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  const handleEdit = (promo) => {
    setSelectedPromo(promo);
    setIsEditModalOpen(true);
  };

  const handleDelete = (promo) => {
    setSelectedPromo(promo);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Promotions</h1>
          <p className="text-muted-foreground">
            Manage discount codes and special offers
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      {/* Active Promotions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Active Promotions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promotions
            .filter((p) => p.active)
            .map((promo) => (
              <Card key={promo.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="font-mono font-semibold text-lg">
                        {promo.code}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {promo.type === "percentage"
                        ? `${promo.discount}% off`
                        : "Free shipping"}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Expires: {new Date(promo.expiresAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(promo)}
                  >
                    <Pencil className="h-4 w-4" />
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
              </Card>
            ))}
        </div>
      </div>

      {/* Inactive Promotions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Inactive Promotions</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="p-4 font-medium">Code</th>
                  <th className="p-4 font-medium">Discount</th>
                  <th className="p-4 font-medium">Expired</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions
                  .filter((p) => !p.active)
                  .map((promo) => (
                    <tr
                      key={promo.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="p-4 font-mono">{promo.code}</td>
                      <td className="p-4">{promo.discount}%</td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(promo.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
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
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Create Promotion Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Promotion</DialogTitle>
            <DialogDescription>
              Add a new discount code or special offer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-code">Promo Code</Label>
                <Input id="create-code" placeholder="SUMMER2025" />
              </div>
              <div>
                <Label htmlFor="create-type">Discount Type</Label>
                <Select defaultValue="percentage">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-discount">Discount Value</Label>
                <Input id="create-discount" type="number" placeholder="15" />
              </div>
              <div>
                <Label htmlFor="create-expires">Expires At</Label>
                <Input id="create-expires" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="create-max-uses">Maximum Uses</Label>
              <Input id="create-max-uses" type="number" placeholder="100" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsCreateModalOpen(false)}>
              Create Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Promotion Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Promotion</DialogTitle>
            <DialogDescription>Update promotion details</DialogDescription>
          </DialogHeader>
          {selectedPromo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-code">Promo Code</Label>
                  <Input id="edit-code" defaultValue={selectedPromo.code} />
                </div>
                <div>
                  <Label htmlFor="edit-type">Discount Type</Label>
                  <Select defaultValue={selectedPromo.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-discount">Discount Value</Label>
                  <Input
                    id="edit-discount"
                    type="number"
                    defaultValue={selectedPromo.discount}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-expires">Expires At</Label>
                  <Input
                    id="edit-expires"
                    type="date"
                    defaultValue={selectedPromo.expiresAt}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditModalOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Promotion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the promotion code "
              {selectedPromo?.code}"? This action cannot be undone.
            </DialogDescription>
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
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Promotions;
