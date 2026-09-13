import { pool } from "../db.ts";

export default class RestaurantModel {
  fetchAllRestaurant = async () => {
    try {
      const query = `SELECT * FROM RESTAURANTS`;
      const res = await pool.query(query);
      return res.rows;
    } catch (error) {
      throw error;
    }
  };

  fetchMenuItemsforRestaurant = async (id?: number) => {
    try {
      const query = `SELECT * FROM MENU_ITEMS WHERE restaurant_id=${id}`;
      const res = await pool.query(query);
      return res.rows;
    } catch (error) {
      throw error;
    }
  };

  checkResturantDetails = async(id?:number) => {
    try{
      const query = `SELECT 1 from restaurants where restaurant_id=${id}`
      const res = await pool.query(query)
      return res.rows
    }catch(error){
      throw error;
    }
  }

  fetchItemFromResturant = async(restaurantId?:number, itemId?:number) =>{
    try{
      const query = `SELECT 1 from MENU_ITEMS where restaurant_id=${restaurantId} and item_id=${itemId}`
      const res = await pool.query(query)
      return res.rows
    }catch(error){
      throw error;
    }
  }
}
