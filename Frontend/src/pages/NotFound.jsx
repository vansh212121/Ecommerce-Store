import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-primary/5 p-4">
      <div className="container max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <div className="w-32 h-32 bg-destructive/10 rounded-full flex items-center justify-center mx-auto border-8 border-destructive/20">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                404
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl pb-2 font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              Page Not Found
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-md mx-auto"
            >
              The page you're looking for doesn't exist or has been moved.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-xl p-4 border border-border max-w-sm mx-auto"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <code className="bg-secondary px-2 py-1 rounded text-xs font-mono">
                  {location.pathname}
                </code>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild size="lg" className="gap-2">
              <a href="/">
                <Home className="h-4 w-4" />
                Back to Home
              </a>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href="/contact">Report Issue</a>
            </Button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-4">
              You might be looking for:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {["/shop", "/about", "/contact", "/faq"].map((link) => (
                <a
                  key={link}
                  href={link}
                  className="px-3 py-2 bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg text-sm font-medium transition-colors"
                >
                  {link === "/shop"
                    ? "Shop"
                    : link === "/about"
                    ? "About"
                    : link === "/contact"
                    ? "Contact"
                    : "FAQ"}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
