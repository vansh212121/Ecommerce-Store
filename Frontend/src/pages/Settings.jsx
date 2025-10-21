import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </Card>

          {/* Password */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Password</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button type="submit">Update Password</Button>
            </form>
          </Card>

          {/* Addresses */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">Home</p>
                    <p className="text-sm text-muted-foreground">
                      123 Main Street
                    </p>
                    <p className="text-sm text-muted-foreground">
                      New York, NY 10001
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                + Add New Address
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive order updates via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive shipping updates via SMS
                  </p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
