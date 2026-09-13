import { pool } from "./db.ts";

export const seedData = async () => {
  try {
    const restaurantCount = await pool.query(
      "SELECT COUNT(*)::int AS count FROM restaurants",
    );

    if (restaurantCount.rows[0].count > 0) {
      return;
    }

    const restaurants = await pool.query(
      `INSERT INTO restaurants (name, address, phone_no)
       VALUES
         ('Spice Garden', '12 MG Road, Bangalore', 9876543210),
         ('Pizza Palace', '45 Park Street, Kolkata', 9123456780),
         ('South Dosa Hub', '78 Anna Salai, Chennai', 9988776655)
       RETURNING restaurant_id, name`,
    );

    const menuItems = [
      { restaurantIndex: 0, items: [
        { name: "Butter Chicken", price: 320 },
        { name: "Paneer Tikka", price: 240 },
        { name: "Garlic Naan", price: 60 },
      ]},
      { restaurantIndex: 1, items: [
        { name: "Margherita Pizza", price: 299 },
        { name: "Farmhouse Pizza", price: 399 },
        { name: "Cold Coffee", price: 120 },
      ]},
      { restaurantIndex: 2, items: [
        { name: "Masala Dosa", price: 120 },
        { name: "Idli Sambar", price: 90 },
        { name: "Filter Coffee", price: 50 },
      ]},
    ];

    for (const group of menuItems) {
      const restaurantId = restaurants.rows[group.restaurantIndex].restaurant_id;

      for (const item of group.items) {
        await pool.query(
          `INSERT INTO menu_items (restaurant_id, name, price)
           VALUES ($1, $2, $3)`,
          [restaurantId, item.name, item.price],
        );
      }
    }

    console.log("Sample restaurants and menu items seeded");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};
