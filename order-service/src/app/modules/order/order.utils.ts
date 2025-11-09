import { OrderStatus } from '@prisma/client';

export const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [
    OrderStatus.PROCESSING,
    OrderStatus.CANCELLED,
    OrderStatus.COMPLETED,
  ],
  [OrderStatus.PROCESSING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.COMPLETED]: [],
};
