import Link from "next/link";
import type { Restaurant } from "@/types";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <article className="card restaurant-card">
      <div className="restaurant-card-banner" aria-hidden="true">🏪</div>
      <div className="restaurant-card-content">
        <h3>{restaurant.name}</h3>
        <p className="muted restaurant-address">{restaurant.address}</p>
        <p className="muted restaurant-phone">{restaurant.phone_no}</p>
        <Link
          href={`/restaurant/${restaurant.restaurant_id}`}
          className="btn btn-primary btn-block"
        >
          View Menu
        </Link>
      </div>
    </article>
  );
}
