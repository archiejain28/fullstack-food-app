"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types";

type CartState = {
  restaurantId: number | null;
  items: CartItem[];
};

type CartContextValue = {
  restaurantId: number | null;
  items: CartItem[];
  addItem: (restaurantId: number, item: CartItem) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({
    restaurantId: null,
    items: [],
  });

  const addItem = useCallback((newRestaurantId: number, item: CartItem) => {
    setCart((current) => {
      const currentItems =
        current.restaurantId && current.restaurantId !== newRestaurantId
          ? []
          : current.items;

      const existing = currentItems.find(
        (cartItem) => cartItem.itemId === item.itemId,
      );

      const nextItems = existing
        ? currentItems.map((cartItem) =>
            cartItem.itemId === item.itemId
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem,
          )
        : [...currentItems, item];

      return {
        restaurantId: newRestaurantId,
        items: nextItems,
      };
    });
  }, []);

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    setCart((current) => {
      if (quantity <= 0) {
        return {
          ...current,
          items: current.items.filter((item) => item.itemId !== itemId),
        };
      }

      return {
        ...current,
        items: current.items.map((item) =>
          item.itemId === itemId ? { ...item, quantity } : item,
        ),
      };
    });
  }, []);

  const removeItem = useCallback((itemId: number) => {
    setCart((current) => ({
      ...current,
      items: current.items.filter((item) => item.itemId !== itemId),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart({ restaurantId: null, items: [] });
  }, []);

  const total = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart.items],
  );

  const itemCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items],
  );

  const value = useMemo(
    () => ({
      restaurantId: cart.restaurantId,
      items: cart.items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      total,
      itemCount,
    }),
    [
      cart.restaurantId,
      cart.items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      total,
      itemCount,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
