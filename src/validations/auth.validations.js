import { z } from 'zod';

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, 'Name is required')
    .max(255, 'Name is too long')
    .trim(),
  email: z.email('Invalid email address').max(255, 'Email is too long').trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password is too long'),
  role: z.enum(['user', 'admin']).default('user'),
});

export const signInSchema = z.object({
  email: z
    .email('Invalid email address')
    .max(255, 'Email is too long')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password is too long'),
});

export const signOutSchema = z.object({
  // No body parameters required for sign-out
});
