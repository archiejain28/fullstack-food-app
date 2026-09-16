import type { User } from "@/types";

export const USER_ROLES = ["ADMIN", "CUSTOMER", "DELIVERY_AGENT"] as const;
export const REGISTER_ROLES = ["CUSTOMER", "DELIVERY_AGENT"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ORDER_STATUSES = ["InProgress", "Delivered", "Cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isAdmin(user: User | null | undefined): boolean {
  return user?.role?.toUpperCase() === "ADMIN";
}
