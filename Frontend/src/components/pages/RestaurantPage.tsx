"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import type { MenuItem, Restaurant } from "@/types";

export default function RestaurantPage() {
  const params = useParams();
  const restaurantId = Number(params?.id);
  const {
    items,
    addItem,
    updateQuantity,
    total,
    itemCount,
    openDrawer,
    restaurantId: cartRestaurantId,
  } = useCart();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!restaurantId) return;

    api
      .getMenu(restaurantId)
      .then((response) => {
        setRestaurant(response.restaurant ?? null);
        setMenu(response.message ?? []);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [restaurantId]);

  const cartItems = cartRestaurantId === restaurantId ? items : [];
  const showCartBar = cartItems.length > 0;

  const getQuantity = (itemId: number) =>
    cartItems.find((item) => item.itemId === itemId)?.quantity ?? 0;

  if (loading) {
    return (
      <div className="page-center">
        <div className="loader" />
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className={`container page${showCartBar ? " has-cart-bar" : ""}`}>
      <Link href="/" className="back-link">← Back to restaurants</Link>

      <section className="hero">
        <h1>{restaurant?.name ?? "Restaurant Menu"}</h1>
        <p className="muted">
          {restaurant?.address ? `${restaurant.address} · ` : ""}
          {menu.length} item{menu.length !== 1 ? "s" : ""} available · Tap ADD to order
        </p>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      {menu.length === 0 ? (
        <div className="empty-state card">
          <p>No menu items available.</p>
        </div>
      ) : (
        <div className="grid menu-grid">
          {menu.map((item) => (
            <MenuItemCard
              key={item.item_id}
              item={item}
              quantity={getQuantity(item.item_id)}
              onAdd={() =>
                addItem(restaurantId, {
                  itemId: item.item_id,
                  name: item.name,
                  quantity: 1,
                  price: Number(item.price),
                })
              }
              onUpdateQuantity={(quantity) =>
                updateQuantity(item.item_id, quantity)
              }
            />
          ))}
        </div>
      )}

      {showCartBar && (
        <button className="floating-cart-bar" onClick={openDrawer}>
          <div className="floating-cart-info">
            <span className="floating-cart-count">
              {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
            </span>
            <span className="floating-cart-action">View Cart →</span>
          </div>
          <span className="floating-cart-total">₹{total.toFixed(2)}</span>
        </button>
      )}
    </div>
  );
}
