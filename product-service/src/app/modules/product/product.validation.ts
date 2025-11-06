import { z } from 'zod';

const createProductZodSchema = z.object({
  body: z
    .object({
      name: z
        .string({ error: 'Product name is required.' })
        .trim()
        .min(3, {
          error: 'Please input a valid product name.',
        })
        .max(50, { error: 'At most 60 characters.' }),
      description: z
        .string({ error: 'Product name is required.' })
        .trim()
        .min(3, {
          error: 'Please input a valid product name.',
        })
        .max(50, { error: 'At most 1000 characters.' }),
      price: z
        .number({ error: 'Product price is required.' })
        .min(0, { message: 'Price cannot be negative' })
        .max(5000000, { message: 'Invalid price' }),
    })
    .strict(),
});

const updateProductZodSchema = z.object({
  body: z
    .object({
      name: z
        .string({ error: 'Product name is required.' })
        .trim()
        .min(3, {
          error: 'Please input a valid product name.',
        })
        .max(50, { error: 'At most 60 characters.' })
        .optional(),
      description: z
        .string({ error: 'Product name is required.' })
        .trim()
        .min(3, {
          error: 'Please input a valid product name.',
        })
        .max(50, { error: 'At most 1000 characters.' })
        .optional(),
      price: z
        .number({ error: 'Product price is required.' })
        .min(0, { message: 'Price cannot be negative' })
        .max(5000000, { message: 'Invalid price' })
        .optional(),
    })
    .strict(),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};
