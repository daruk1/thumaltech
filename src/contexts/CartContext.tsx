import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  itemNumber: number;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (itemNumber: number) => void;
  updateQuantity: (itemNumber: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.itemNumber === item.itemNumber);
      if (existing) {
        return prev.map((i) =>
          i.itemNumber === item.itemNumber ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemNumber: number) => {
    setItems((prev) => prev.filter((i) => i.itemNumber !== itemNumber));
  };

  const updateQuantity = (itemNumber: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemNumber);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.itemNumber === itemNumber ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.priceNum * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
