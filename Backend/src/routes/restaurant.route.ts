import express from "express";
import RestaurantController from "../controllers/restaurant.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = express.Router();

const restaurantController = new RestaurantController();

/**
 * @swagger
 * /restaurant/list:
 *   get:
 *     summary: list of restaurant
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Restaurant
 *     responses:
 *       201:
 *         description: Restaurant List fetched successfully
 */

router.get("/list", authMiddleware, restaurantController.getRestaurantList);

/**
 * @swagger
 * /restaurant/{id}:
 *   get:
 *     summary: get restaurant's menu list
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Restaurant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Restaurant fetched successfully
 */

router.get(
  "/:id",
  authMiddleware,
  restaurantController.getMenuListOfRestaurant,
);

export default router;
