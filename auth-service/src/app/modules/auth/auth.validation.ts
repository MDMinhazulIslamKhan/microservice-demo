import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(4, { error: 'Password must be at least 4 characters long.' });

export const strongPasswordSchema = z
  .string({ error: 'Password is required.' })
  .min(8, { error: 'Password must be at least 8 characters long.' })
  .max(30, { error: 'Password must be at most 30 characters long.' })
  .regex(/[a-z]/, {
    error: 'Password must contain at least one lowercase letter.',
  })
  .regex(/[A-Z]/, {
    error: 'Password must contain at least one uppercase letter.',
  })
  .regex(/\d/, { error: 'Password must contain at least one number.' })
  .regex(/[^A-Za-z0-9]/, {
    error: 'Password must contain at least one special character.',
  })
  .refine(val => !/\s/.test(val), {
    error: 'Password must not contain spaces.',
  });

const loginUserZodSchema = z.object({
  body: z
    .object({
      email: z.email({ error: 'Invalid email format.' }),
      password: passwordSchema,
    })
    .strict(),
});

const changePasswordZodSchema = z.object({
  body: z
    .object({
      oldPassword: passwordSchema,
      newPassword: strongPasswordSchema,
    })
    .strict(),
});

const registrationUserZodSchema = z.object({
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
        .trim()
        .regex(/^(\+?\d{9,15})$/, {
          error: 'Invalid phone number.',
        })
        .optional(),
      address: z.string().optional(),
    })
    .strict(),
});

const refreshTokenTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      error: 'Refresh Token is required.',
    }),
  }),
});

export const AuthValidation = {
  loginUserZodSchema,
  changePasswordZodSchema,
  registrationUserZodSchema,
  refreshTokenTokenZodSchema,
};
