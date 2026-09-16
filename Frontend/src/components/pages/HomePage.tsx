"use client";

import { useEffect, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import { api } from "@/lib/api";
import type { Restaurant } from "@/types";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getRestaurants()
      .then((response) => setRestaurants(response.message ?? []))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-center">
        <div className="loader" />
        <p>Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container page">
      <section className="hero">
        <h1>Discover Restaurants</h1>
        <p className="muted">
          {restaurants.length > 0
            ? `${restaurants.length} restaurant${restaurants.length !== 1 ? "s" : ""} near you`
            : "Browse nearby restaurants and order your favorites."}
        </p>
      </section>

      {restaurants.length === 0 ? (
        <div className="empty-state card">
          <p>No restaurants available yet.</p>
        </div>
      ) : (
        <div className="grid restaurant-grid">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.restaurant_id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
