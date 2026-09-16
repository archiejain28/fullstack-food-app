import type { Request, Response } from "express";
import RestaurantModel from "../model/restaurant.model.ts";

export default class RestaurantController {
  restaurantModel = new RestaurantModel();

  getRestaurantList = async (req:Request, res: Response) => {
    try {
      const response = await this.restaurantModel.fetchAllRestaurant();

      res.status(200).json({
        status: true,
        message: response,
      });
    } catch (error) {
      console.error("Something went wrong", error);
      res.status(500).json({
        status: false,
        message: "Something went wrong while fetching the restaurants list",
      });
    }
  };

  getMenuListOfRestaurant = async (req:Request, res: Response) => {
    try {
      const id = Number(req.params?.id);
      const restaurant = await this.restaurantModel.fetchRestaurantById(id);

      if (!restaurant) {
        return res.status(404).json({
          status: false,
          message: "Restaurant not found",
        });
      }

      const response = await this.restaurantModel.fetchMenuItemsforRestaurant(id);

      res.status(200).json({
        status: true,
        restaurant,
        message: response,
      });
    } catch (error) {
      console.error("Something went wrong", error);
      res.status(500).json({
        status: false,
        message: "Something went wrong while fetching the menu list",
      });
    }
  };
}
