import type { OrderItem } from "@/types";

export function getOrderTotal(items: OrderItem[] = []): number {
  return items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
}
