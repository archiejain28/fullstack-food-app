"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Order } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getMyOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-center">
        <div className="loader" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container page">
      <section className="hero">
        <h1>My Orders</h1>
        <p className="muted">Track your recent food orders.</p>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-state card">
          <p>You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.order_id} className="card order-card">
              <div className="order-header">
                <h3>Order #{order.order_id}</h3>
                <span
                  className={`status-badge status-${order.status?.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <p><strong>Restaurant ID:</strong> {order.restaurant_id}</p>
                <p><strong>Order Date:</strong> {order.created_at}</p>
                {order.items && order.items.length > 0 && (
                  <ul className="cart-list">
                    {order.items.map((item) => (
                      <li key={item.item_id} className="cart-item">
                        <span>{item.name}</span>
                        <span>
                          {item.quantity} × ₹{item.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
