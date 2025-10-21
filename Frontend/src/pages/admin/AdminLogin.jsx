import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Admin auth logic here
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
          <p className="text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="adminEmail">Email</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@atelier.com"
              />
            </div>
            <div>
              <Label htmlFor="adminPassword">Password</Label>
              <Input id="adminPassword" type="password" />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Sign In"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
