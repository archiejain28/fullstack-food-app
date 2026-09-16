"use client";

type CartRestaurantSwitchModalProps = {
  currentRestaurantName: string;
  newRestaurantName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function CartRestaurantSwitchModal({
  currentRestaurantName,
  newRestaurantName,
  onConfirm,
  onCancel,
}: CartRestaurantSwitchModalProps) {
  return (
    <div className="cart-switch-overlay" onClick={onCancel}>
      <div
        className="card cart-switch-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-switch-title"
      >
        <h2 id="cart-switch-title">Switch restaurant?</h2>
        <p className="muted">
          Your cart has items from <strong>{currentRestaurantName}</strong>. Items
          in one order must be from the same restaurant.
        </p>
        <p>
          Replace your cart with items from <strong>{newRestaurantName}</strong>?
        </p>
        <div className="cart-switch-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Keep Current Cart
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Replace & Add
          </button>
        </div>
      </div>
    </div>
  );
}
