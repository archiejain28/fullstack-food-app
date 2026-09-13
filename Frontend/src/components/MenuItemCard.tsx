"use client";



import type { MenuItem } from "@/types";



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

      <div className="menu-item-header">

        <h3>{item.name}</h3>

        <span className="price">₹{price.toFixed(2)}</span>

      </div>



      {quantity === 0 ? (

        <button className="btn btn-primary btn-block" onClick={onAdd}>

          Add to Cart

        </button>

      ) : (

        <div className="quantity-controls">

          <button

            className="btn btn-secondary"

            onClick={() => onUpdateQuantity(quantity - 1)}

          >

            −

          </button>

          <span>{quantity}</span>

          <button

            className="btn btn-secondary"

            onClick={() => onUpdateQuantity(quantity + 1)}

          >

            +

          </button>

        </div>

      )}

    </article>

  );

}


