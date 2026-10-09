import { z } from 'zod';

export const createClinicSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter your clinic name')
    .max(120, 'Keep the name under 120 characters'),
  address: z
    .string()
    .trim()
    .min(5, 'Enter the full street address')
    .max(255, 'Keep the address under 255 characters'),
});

export type CreateClinicInput = z.infer<typeof createClinicSchema>;
