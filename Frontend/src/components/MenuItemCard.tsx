"use client";

import type { MenuItem } from "@/types";

const FOOD_EMOJIS = ["🍔", "🍕", "🍟", "🌮", "🍜", "🍛", "🥗", "🍗", "🥪", "🌯"];

function getItemEmoji(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FOOD_EMOJIS[Math.abs(hash) % FOOD_EMOJIS.length];
}

type MenuItemCardProps = {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onUpdateQuantity: (quantity: number) => void;
};

export default function MenuItemCard({
  item,
  quantity,
  onAdd,
  onUpdateQuantity,
}: MenuItemCardProps) {
  const price = Number(item.price);

  return (
    <article className="card menu-item-card">
      <div className="menu-item-image" aria-hidden="true">
        {getItemEmoji(item.name)}
      </div>

      <div className="menu-item-content">
        <h3>{item.name}</h3>

        <div className="menu-item-row">
          <span className="price">₹{price.toFixed(2)}</span>

          {quantity === 0 ? (
            <button className="btn btn-primary btn-add" onClick={onAdd}>
              ADD
            </button>
          ) : (
            <div className="qty-stepper">
              <button
                className="qty-stepper-btn"
                onClick={() => onUpdateQuantity(quantity - 1)}
                aria-label={`Decrease ${item.name} quantity`}
              >
                −
              </button>
              <span className="qty-stepper-value">{quantity}</span>
              <button
                className="qty-stepper-btn"
                onClick={() => onUpdateQuantity(quantity + 1)}
                aria-label={`Increase ${item.name} quantity`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
