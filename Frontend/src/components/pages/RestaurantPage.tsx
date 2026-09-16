"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CartRestaurantSwitchModal from "@/components/CartRestaurantSwitchModal";
import MenuItemCard from "@/components/MenuItemCard";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import type { CartItem, MenuItem, Restaurant } from "@/types";

type PendingAdd = {
  item: CartItem;
};

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
    restaurantName: cartRestaurantName,
    hasItemsFromDifferentRestaurant,
  } = useCart();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingAdd, setPendingAdd] = useState<PendingAdd | null>(null);

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
  const restaurantName = restaurant?.name ?? "Restaurant";

  const getQuantity = (itemId: number) =>
    cartItems.find((item) => item.itemId === itemId)?.quantity ?? 0;

  const handleAdd = (menuItem: MenuItem) => {
    const cartItem: CartItem = {
      itemId: menuItem.item_id,
      name: menuItem.name,
      quantity: 1,
      price: Number(menuItem.price),
    };

    if (hasItemsFromDifferentRestaurant(restaurantId)) {
      setPendingAdd({ item: cartItem });
      return;
    }

    addItem(restaurantId, cartItem, restaurantName);
  };

  const confirmRestaurantSwitch = () => {
    if (!pendingAdd) return;

    addItem(restaurantId, pendingAdd.item, restaurantName, true);
    setPendingAdd(null);
  };

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
              onAdd={() => handleAdd(item)}
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

      {pendingAdd && cartRestaurantName && (
        <CartRestaurantSwitchModal
          currentRestaurantName={cartRestaurantName}
          newRestaurantName={restaurantName}
          onConfirm={confirmRestaurantSwitch}
          onCancel={() => setPendingAdd(null)}
        />
      )}
    </div>
  );
}
