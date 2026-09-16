import type { MenuItem, Order, Restaurant, User } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data as T;
}

export const api = {
  getProfile: () => request<User>("/users/profile"),
  updateAddress: (address: string) =>
    request<{ message: string }>("/users/profile/updateAddress", {
      method: "PATCH",
      body: JSON.stringify({ address }),
    }),
  updatePhoneNumber: (phone_no: string) =>
    request<{ message: string }>("/users/profile/updatePhoneNumber", {
      method: "PATCH",
      body: JSON.stringify({ phone_no }),
    }),
  getRestaurants: () =>
    request<{ status: boolean; message: Restaurant[] }>("/restaurant/list"),
  getMenu: (restaurantId: number) =>
    request<{ status: boolean; restaurant: Restaurant; message: MenuItem[] }>(
      `/restaurant/${restaurantId}`,
    ),
  createOrder: (payload: {
    restaurant_id: number;
    itemDetails: { itemId: number; quantity: number; price: number }[];
  }) =>
    request<{ message: string; data: unknown }>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getMyOrders: () => request<Order[]>("/orders/myOrders"),
};

export const AUTH_URL = `${API_BASE}/auth/google`;
export const DEV_AUTH_URL = `${API_BASE}/auth/dev/login`;