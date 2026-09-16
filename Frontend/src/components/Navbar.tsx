"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { isAdmin } from "@/lib/roles";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand">
          <span className="brand-icon">🍽️</span>
          FoodApp
        </Link>

        {user && (
          <nav className="nav-links">
            <Link href="/" className={linkClass("/")}>Restaurants</Link>
            <Link href="/orders" className={linkClass("/orders")}>
              My Orders
            </Link>
            <Link href="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
            {isAdmin(user) && (
              <>
                <Link href="/admin/users" className={linkClass("/admin/users")}>
                  Users
                </Link>
                <Link href="/admin/orders" className={linkClass("/admin/orders")}>
                  Manage Orders
                </Link>
              </>
            )}
          </nav>
        )}

        <div className="navbar-actions">
          {user && itemCount > 0 && (
            <button
              className="cart-button"
              onClick={openDrawer}
              aria-label={`Open cart with ${itemCount} items`}
            >
              <span className="cart-button-icon">🛒</span>
              <span className="cart-button-count">{itemCount}</span>
            </button>
          )}

          {user ? (
            <>
              <span className="user-greeting">Hi, {user.name}</span>
              <button className="btn btn-secondary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </header>
  );
}
