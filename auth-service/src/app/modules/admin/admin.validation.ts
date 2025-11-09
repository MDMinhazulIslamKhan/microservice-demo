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

export const AdminValidation = {
  updateCompanyZodSchema,
};
