import { z } from 'zod';

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email('Enter a valid email address');

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter your full name')
    .max(80, 'Name is too long'),
  email,
  password: z
    .string()
    .min(8, 'Use at least 8 characters')
    .max(128, 'Password is too long'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
});

export type SignInInput = z.infer<typeof signInSchema>;
