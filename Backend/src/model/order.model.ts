import { pool } from "../db.ts";
export type itemDetailsType = {
  itemId: number;
  quantity: number;
  price: number;
};

export default class OrderModel {
  createOrder = async (
    userId: number,
    itemDetails: itemDetailsType[],
    restaurantId: number,
  ) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const query1 = `INSERT into orders (user_id, restaurant_id, status, created_at) values ($1, $2, 'inProgress', NOW()) returning *`;
      const orderRes = await client.query(query1, [userId, restaurantId]);
      const query2 = `INSERT into order_items (order_id,item_id,quantity,price) values ($1,$2,$3,$4) returning *`;
      const orderItemRes = await Promise.all(
        itemDetails.map(async (item) => {
          const result = await client.query(query2, [
            orderRes.rows[0].order_id,
            item.itemId,
            item.quantity,
            item.price,
          ]);
          return result.rows[0];
        }),
      );

      await client.query("COMMIT");

      return {
        order: orderRes.rows[0],
        orderItem: orderItemRes,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  };

  fetchUserOrders = async (userId: number) => {
    try {
      const orderDetails = await pool.query(
        `SELECT o.*, r.name AS restaurant_name
         FROM orders o
         JOIN restaurants r ON r.restaurant_id = o.restaurant_id
         WHERE o.user_id = $1
         ORDER BY o.order_id DESC`,
        [userId],
      );

      const orders = await Promise.all(
        orderDetails.rows.map(async (order) => {
          const orderItems = await pool.query(
            `SELECT oi.*, mi.name
             FROM order_items oi
             JOIN menu_items mi ON mi.item_id = oi.item_id
             WHERE oi.order_id = $1`,
            [order.order_id],
          );

          return {
            ...order,
            items: orderItems.rows,
          };
        }),
      );

      return orders;
    } catch (error) {
      throw error;
    }
  };

  fetchAllOrders = async () => {
    try {
      const orderDetails = await pool.query(
        `SELECT o.*, r.name AS restaurant_name, u.name AS user_name, u.email AS user_email
         FROM orders o
         JOIN restaurants r ON r.restaurant_id = o.restaurant_id
         JOIN users u ON u.user_id = o.user_id
         ORDER BY o.order_id DESC`,
      );

      const orders = await Promise.all(
        orderDetails.rows.map(async (order) => {
          const orderItems = await pool.query(
            `SELECT oi.*, mi.name
             FROM order_items oi
             JOIN menu_items mi ON mi.item_id = oi.item_id
             WHERE oi.order_id = $1`,
            [order.order_id],
          );

          return {
            ...order,
            items: orderItems.rows,
          };
        }),
      );

      return orders;
    } catch (error) {
      throw error;
    }
  };

  fetchUserOrder = async (userId?: number) => {
    try {
      const query = `SELECT * from orders where user_id=${userId}`;
      const orderDetails = await pool.query(query);
      if (orderDetails) {
        const query = `SELECT * from order_items where order_id=${orderDetails.rows[0].order_id}`;
        const orderItemDetails = await pool.query(query);

        return { ...orderDetails.rows[0], ...orderItemDetails.rows[0] };
      }
    } catch (error) {
      throw error;
    }
  };

  updateOrderStatus = async (orderId?: number, status?: string) => {
    try {
      const query = `UPDATE orders SET status = $1 where order_id = $2`;
      const orderDetails = await pool.query(query, [status, orderId]);
      if (orderDetails) {
        return { ...orderDetails };
      }
    } catch (error) {
      throw error;
    }
  };
}
