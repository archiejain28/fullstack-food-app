"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";

type CartContentProps = {
  onOrderPlaced?: () => void;
};

export default function CartContent({ onOrderPlaced }: CartContentProps) {
  const router = useRouter();
  const { items, restaurantId, total, clearCart, updateQuantity } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePlaceOrder = async () => {
    if (items.length === 0 || !restaurantId) return;

    setPlacingOrder(true);
    setError("");
    setSuccess("");

    try {
      await api.createOrder({
        restaurant_id: restaurantId,
        itemDetails: items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      clearCart();
      setSuccess("Order placed successfully!");
      onOrderPlaced?.();
      setTimeout(() => router.push("/orders"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return <p className="muted">Your cart is empty.</p>;
  }

  return (
    <>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.itemId} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-price">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
            <div className="cart-item-controls">
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                aria-label={`Decrease ${item.name} quantity`}
              >
                −
              </button>
              <span className="cart-item-qty">{item.quantity}</span>
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                aria-label={`Increase ${item.name} quantity`}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-total">
        <strong>Total</strong>
        <strong>₹{total.toFixed(2)}</strong>
      </div>

      {restaurantId && (
        <Link
          href={`/restaurant/${restaurantId}`}
          className="btn btn-secondary btn-block cart-menu-link"
        >
          View Menu
        </Link>
      )}

      <button
        className="btn btn-primary btn-block"
        onClick={handlePlaceOrder}
        disabled={placingOrder || !!success}
      >
        {placingOrder ? "Placing Order..." : "Place Order"}
      </button>
    </>
  );
}
