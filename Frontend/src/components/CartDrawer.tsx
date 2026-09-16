"use client";

import { useEffect } from "react";
import CartContent from "@/components/CartContent";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <aside
        className="cart-drawer"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="cart-drawer-header">
          <h2>Your Cart</h2>
          <button
            className="btn btn-secondary btn-icon cart-drawer-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>
        <div className="cart-drawer-body">
          <CartContent onOrderPlaced={onClose} />
        </div>
      </aside>
    </div>
  );
}
