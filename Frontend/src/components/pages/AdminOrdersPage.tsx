"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatToIST } from "@/lib/date";
import { getOrderTotal } from "@/lib/order";
import { ORDER_STATUSES } from "@/lib/roles";
import type { Order } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusDrafts, setStatusDrafts] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    api
      .getAllOrders()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setOrders(list);
        setStatusDrafts(
          Object.fromEntries(list.map((order) => [order.order_id, order.status])),
        );
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId: number) => {
    const newStatus = statusDrafts[orderId];
    if (!newStatus) return;

    setSavingId(orderId);
    setError("");
    setMessage("");

    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((current) =>
        current.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
      setMessage(`Order #${orderId} status updated.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSavingId(null);
    }
  };

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
        <h1>Manage Orders</h1>
        <p className="muted">View all orders and update their status.</p>
      </section>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {orders.length === 0 ? (
        <div className="empty-state card">
          <p>No orders found.</p>
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
                <p><strong>Customer:</strong> {order.user_name ?? "—"}</p>
                <p><strong>Email:</strong> {order.user_email ?? "—"}</p>
                <p>
                  <strong>Restaurant:</strong>{" "}
                  {order.restaurant_name ?? `ID ${order.restaurant_id}`}
                </p>
                <p><strong>Order Date:</strong> {formatToIST(order.created_at)}</p>

                {order.items && order.items.length > 0 && (
                  <>
                    <ul className="cart-list">
                      {order.items.map((item) => (
                        <li key={item.item_id} className="cart-item">
                          <span>{item.name}</span>
                          <span>
                            {item.quantity} × ₹{Number(item.price).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="cart-total">
                      <strong>Total</strong>
                      <strong>₹{getOrderTotal(order.items).toFixed(2)}</strong>
                    </div>
                  </>
                )}

                <div className="admin-order-actions">
                  <select
                    className="admin-select"
                    value={statusDrafts[order.order_id] ?? order.status}
                    onChange={(event) =>
                      setStatusDrafts((current) => ({
                        ...current,
                        [order.order_id]: event.target.value,
                      }))
                    }
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleStatusChange(order.order_id)}
                    disabled={
                      savingId === order.order_id ||
                      statusDrafts[order.order_id] === order.status
                    }
                  >
                    {savingId === order.order_id ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
