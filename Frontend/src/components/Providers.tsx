"use client";

import CartDrawer from "@/components/CartDrawer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider, useCart } from "@/context/CartContext";

function CartDrawerHost() {
  const { drawerOpen, closeDrawer } = useCart();
  return <CartDrawer open={drawerOpen} onClose={closeDrawer} />;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartDrawerHost />
      </CartProvider>
    </AuthProvider>
  );
}
