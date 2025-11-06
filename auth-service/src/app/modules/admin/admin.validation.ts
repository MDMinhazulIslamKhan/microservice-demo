import { z } from 'zod';

const updateCompanyZodSchema = z.object({
  body: z
    .object({
      name: z
        .string({ error: 'Company name is required.' })
        .trim()
        .min(3, {
          error: 'Please input a valid company name.',
        })
        .max(60, { error: 'At most 60 characters.' }),
    })
    .strict(),
});

const createAdmin = z.object({
  body: z
    .object({
      name: z
        .string({
          error: 'Name is required',
        })
        .trim()
        .min(4, {
          error: 'Please input a valid full name.',
        })
        .max(60, { error: 'At most 60 characters.' }),
      email: z.email({
        error: 'Valid email is required.',
      }),
      contactNumber: z
        .string()
        .regex(/^(\+?\d{9,15})$/, {
          error: 'Invalid phone number.',
        })
        .optional(),
      address: z.string().optional(),
    })
    .strict(),
});

export const AdminValidation = {
  updateCompanyZodSchema,
  createAdmin,
};
