export type User = {
  user_id: number;
  name: string;
  email: string;
  address: string;
  phone_no: string;
  role: string;
};

export type Restaurant = {
  restaurant_id: number;
  name: string;
  address: string;
  phone_no: number;
};

export type MenuItem = {
  item_id: number;
  restaurant_id: number;
  name: string;
  price: string | number;
};

export type CartItem = {
  itemId: number;
  name: string;
  quantity: number;
  price: number;
};

export type OrderItem = {
  item_id: number;
  quantity: number;
  price: number;
  name: string;
};

export type Order = {
  order_id: number;
  user_id: number;
  restaurant_id: number;
  created_at: string;
  status: string;
  items?: OrderItem[];
};
