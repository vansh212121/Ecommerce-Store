import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (product, size, color, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        toast.success("Updated quantity in cart");
        return updated;
      }

      toast.success("Added to cart");
      return [
        ...prev,
        { ...product, selectedSize: size, selectedColor: color, quantity },
      ];
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
    toast.success("Removed from cart");
  };

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success("Cart cleared");
  };

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        toast.info("Already in wishlist");
        return prev;
      }
      toast.success("Added to wishlist");
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    toast.success("Removed from wishlist");
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
