"use client";



import Link from "next/link";

import { useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import MenuItemCard from "@/components/MenuItemCard";

import { api } from "@/lib/api";

import { useCart } from "@/context/CartContext";

import type { MenuItem } from "@/types";



export default function RestaurantPage() {

  const params = useParams();

  const router = useRouter();

  const restaurantId = Number(params?.id);

  const {

    items,

    addItem,

    updateQuantity,

    total,

    clearCart,

    restaurantId: cartRestaurantId,

  } = useCart();



  const [menu, setMenu] = useState<MenuItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [placingOrder, setPlacingOrder] = useState(false);

  const [success, setSuccess] = useState("");



  useEffect(() => {

    if (!restaurantId) return;



    api

      .getMenu(restaurantId)

      .then((response) => setMenu(response.message ?? []))

      .catch((err: Error) => setError(err.message))

      .finally(() => setLoading(false));

  }, [restaurantId]);



  const cartItems = cartRestaurantId === restaurantId ? items : [];

  const cartTotal = cartRestaurantId === restaurantId ? total : 0;



  const getQuantity = (itemId: number) =>

    cartItems.find((item) => item.itemId === itemId)?.quantity ?? 0;



  const handlePlaceOrder = async () => {

    if (cartItems.length === 0) return;



    setPlacingOrder(true);

    setError("");

    setSuccess("");



    try {

      await api.createOrder({

        restaurant_id: restaurantId,

        itemDetails: cartItems.map((item) => ({

          itemId: item.itemId,

          quantity: item.quantity,

          price: item.price,

        })),

      });



      clearCart();

      setSuccess("Order placed successfully!");

      setTimeout(() => router.push("/orders"), 1500);

    } catch (err) {

      setError(err instanceof Error ? err.message : "Failed to place order");

    } finally {

      setPlacingOrder(false);

    }

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

    <div className="container page">

      <Link href="/" className="back-link">← Back to restaurants</Link>



      <section className="hero">

        <h1>Restaurant Menu</h1>

        <p className="muted">Add items to your cart and place an order.</p>

      </section>



      {error && <div className="alert alert-error">{error}</div>}

      {success && <div className="alert alert-success">{success}</div>}



      <div className="restaurant-layout">

        <div className="grid menu-grid">

          {menu.length === 0 ? (

            <div className="empty-state card">

              <p>No menu items available.</p>

            </div>

          ) : (

            menu.map((item) => (

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

            ))

          )}

        </div>



        <aside className="card cart-panel">

          <h2>Your Cart</h2>

          {cartItems.length === 0 ? (

            <p className="muted">Your cart is empty.</p>

          ) : (

            <>

              <ul className="cart-list">

                {cartItems.map((item) => (

                  <li key={item.itemId} className="cart-item">

                    <span>{item.name}</span>

                    <span>

                      {item.quantity} × ₹{item.price.toFixed(2)}

                    </span>

                  </li>

                ))}

              </ul>

              <div className="cart-total">

                <strong>Total</strong>

                <strong>₹{cartTotal.toFixed(2)}</strong>

              </div>

              <button

                className="btn btn-primary btn-block"

                onClick={handlePlaceOrder}

                disabled={placingOrder}

              >

                {placingOrder ? "Placing Order..." : "Place Order"}

              </button>

            </>

          )}

        </aside>

      </div>

    </div>

  );

}


