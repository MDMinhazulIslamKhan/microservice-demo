import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z
    .object({
      productId: z
        .string({ error: 'Product id is required.' })
        .min(6, { message: 'Product id must be at least 6 characters.' }),
      quantity: z
        .number({ error: 'Quantity is required.' })
        .int({ message: 'Quantity must be an integer.' })
        .positive({ message: 'Quantity must be greater than zero.' }),
    })
    .strict(),
});

const updateStatusZodSchema = z.object({
  body: z
    .object({
      orderId: z
        .string({ error: 'Order id is required.' })
        .min(6, { message: 'Order id must be at least 6 characters.' }),
      status: z.enum(OrderStatus),
    })
    .strict(),
});

export const OrderValidation = {
  createOrderZodSchema,
  updateStatusZodSchema,
};
