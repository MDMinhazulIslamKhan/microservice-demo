import { z } from 'zod';

const updateProfileZodSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(4, {
          error: 'Please input a valid full name.',
        })
        .max(60, { error: 'At most 60 characters.' })
        .optional(),
      contactNumber: z
        .string()
        .trim()
        .regex(/^(\+?\d{9,15})$/, {
          error: 'Invalid phone number.',
        })
        .optional(),
    })
    .strict(),
});

export const UserValidation = {
  updateProfileZodSchema,
};
