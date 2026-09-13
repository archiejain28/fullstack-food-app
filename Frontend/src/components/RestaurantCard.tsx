import Link from "next/link";

import type { Restaurant } from "@/types";



export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {

  return (

    <article className="card restaurant-card">

      <div className="card-icon">🏪</div>

      <h3>{restaurant.name}</h3>

      <p className="muted">{restaurant.address}</p>

      <p className="muted">Phone: {restaurant.phone_no}</p>

      <Link

        href={`/restaurant/${restaurant.restaurant_id}`}

        className="btn btn-primary btn-block"

      >

        View Menu

      </Link>

    </article>

  );

}


