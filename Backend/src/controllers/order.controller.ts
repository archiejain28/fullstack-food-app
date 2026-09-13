import type { Response, Request } from "express";
import RestaurantModel from "../model/restaurant.model.ts";
import OrderModel from "../model/order.model.ts";
import type { itemDetailsType } from "../model/order.model.ts";
import UserModel from "../model/user.model.ts";
import type { UserType } from "../types/user.types.ts";
import { orderSchema } from "../validators/order.validator.ts";

export default class OrderController {
  restaurantModel = new RestaurantModel();
  orderModel = new OrderModel();
  userModel = new UserModel();

  createOrder = async (req: Request, res: Response) => {
    try {
      const { value, error } = orderSchema.validate(req.body);
      const { itemDetails, restaurant_id } = value;

      const { user_id } = req.user as UserType;

      if (error) {
        throw new Error(error?.details[0]?.message);
      }

      const checkRestaurantDetails =
        await this.restaurantModel.checkResturantDetails(restaurant_id);
      for (const item of itemDetails) {
        const result = await this.restaurantModel.fetchItemFromResturant(
          restaurant_id,
          item.itemId,
        );

        if (result.length === 0) {
          throw new Error(
            `Item ${item.itemId} does not belong to the restaurant.`,
          );
        }
      }

      if (checkRestaurantDetails.length == 0) {
        throw new Error("Restaurant not found with this id");
      }

      if (checkRestaurantDetails.length > 0) {
        const data = await this.orderModel.createOrder(
          user_id,
          itemDetails,
          restaurant_id,
        );
        res.status(200).json({
          message: "Order placed sucessfully",
          data: data,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          status: false,
          message: error.message,
        });
      }
      res.status(500).json({
        message: error,
      });
    }
  };

  fetchMyOrders = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.user as UserType;
      const isUserExists = await this.userModel.fetchUserByUserId(user_id);

      if (isUserExists) {
        const data = await this.orderModel.fetchUserOrders(user_id);
        res.status(200).json(data);
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      res.status(500).json({
        message: "Error while fetching the orders",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    try {
      const { newStatus } = req.body;
      const { id } = req.params;
      const data = await this.orderModel.updateOrderStatus(
        Number(id),
        newStatus,
      );
      res.status(200).json({
        message: "updated sucessfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Error while updating order status",
        error: error,
      });
    }
  };
}
