import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Atelier</h3>
            <p className="text-sm text-muted-foreground">
              Curated contemporary fashion for the modern wardrobe.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/men"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/women"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/unisex"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Unisex
                </Link>
              </li>
              <li>
                <Link
                  to="/new"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Shipping
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 Atelier. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
