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
  restaurantName: string | null;
  items: CartItem[];
};

type CartContextValue = {
  restaurantId: number | null;
  restaurantName: string | null;
  items: CartItem[];
  addItem: (
    restaurantId: number,
    item: CartItem,
    restaurantName: string,
    replaceExisting?: boolean,
  ) => void;
  hasItemsFromDifferentRestaurant: (restaurantId: number) => boolean;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({
    restaurantId: null,
    restaurantName: null,
    items: [],
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const hasItemsFromDifferentRestaurant = useCallback(
    (restaurantId: number) =>
      cart.restaurantId !== null &&
      cart.restaurantId !== restaurantId &&
      cart.items.length > 0,
    [cart.restaurantId, cart.items.length],
  );

  const addItem = useCallback(
    (
      newRestaurantId: number,
      item: CartItem,
      restaurantName: string,
      replaceExisting = false,
    ) => {
      setCart((current) => {
        const switchingRestaurant =
          current.restaurantId !== null &&
          current.restaurantId !== newRestaurantId &&
          current.items.length > 0;

        if (switchingRestaurant && !replaceExisting) {
          return current;
        }

        const currentItems = switchingRestaurant ? [] : current.items;

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
          restaurantName,
          items: nextItems,
        };
      });
    },
    [],
  );

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
    setCart({ restaurantId: null, restaurantName: null, items: [] });
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
      restaurantName: cart.restaurantName,
      items: cart.items,
      addItem,
      hasItemsFromDifferentRestaurant,
      updateQuantity,
      removeItem,
      clearCart,
      total,
      itemCount,
      drawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [
      cart.restaurantId,
      cart.restaurantName,
      cart.items,
      addItem,
      hasItemsFromDifferentRestaurant,
      updateQuantity,
      removeItem,
      clearCart,
      total,
      itemCount,
      drawerOpen,
      openDrawer,
      closeDrawer,
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
