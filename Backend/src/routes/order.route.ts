import express from "express";
import OrderController from "../controllers/order.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { isLoggedUserAdmin } from "../middleware/roles.middleware.ts";

const router = express.Router();

const orderController = new OrderController();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a order
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurant_id:
 *                 type: number
 *               itemDetails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 */

router.post("/", authMiddleware, orderController.createOrder);

/**
 * @swagger
 * /orders/myOrders:
 *   get:
 *     summary: list of myorder
 *     tags:
 *       - Order
 *     responses:
 *       201:
 *         description: Order List fetched successfully
 */

router.get("/myOrders", authMiddleware, orderController.fetchMyOrders);

/**
 * @swagger
 * /orders/updateOrderStatus/{id}:
 *   patch:
 *     summary: Update Order Status
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newStatus:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order status updated successfully
 */

router.patch(
  "/updateOrderStatus/:id",
  authMiddleware,
  isLoggedUserAdmin,
  orderController.updateOrderStatus,
);

export default router;
