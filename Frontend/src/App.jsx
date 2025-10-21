import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Search from "./pages/Search";
import Wishlist from "./pages/Wishlist";
import OrderHistory from "./pages/OrderHistory";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Inventory from "./pages/admin/Inventory";
import Promotions from "./pages/admin/Promotions";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";

const App = () => (
  <CartProvider>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }
          />
          <Route
            path="/men"
            element={
              <>
                <Navbar />
                <CategoryPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/women"
            element={
              <>
                <Navbar />
                <CategoryPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/unisex"
            element={
              <>
                <Navbar />
                <CategoryPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/new"
            element={
              <>
                <Navbar />
                <CategoryPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/product/:id"
            element={
              <>
                <Navbar />
                <ProductDetail />
                <Footer />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <Navbar />
                <Cart />
                <Footer />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                <Navbar />
                <Checkout />
                <Footer />
              </>
            }
          />
          <Route
            path="/search"
            element={
              <>
                <Navbar />
                <Search />
                <Footer />
              </>
            }
          />
          <Route
            path="/wishlist"
            element={
              <>
                <Navbar />
                <Wishlist />
                <Footer />
              </>
            }
          />
          <Route
            path="/orders"
            element={
              <>
                <Navbar />
                <OrderHistory />
                <Footer />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <Navbar />
                <Settings />
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
                <Footer />
              </>
            }
          />
          <Route
            path="/faq"
            element={
              <>
                <Navbar />
                <FAQ />
                <Footer />
              </>
            }
          />
          <Route path="/auth" element={<Auth />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="promotions" element={<Promotions />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </CartProvider>
);

export default App;
