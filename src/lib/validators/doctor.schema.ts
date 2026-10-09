import { z } from 'zod';

export const doctorApplicationSchema = z.object({
  clinicId: z.string().min(1, 'Select a clinic'),
  specialty: z
    .string()
    .trim()
    .min(2, 'Enter your specialty')
    .max(120, 'Keep the specialty under 120 characters'),
  consultationFee: z
    .string()
    .trim()
    .min(1, 'Enter your consultation fee')
    .regex(/^\d{1,5}(\.\d{1,2})?$/, 'Use a number such as 45 or 45.50')
    .refine(value => Number(value) > 0, 'The fee must be greater than zero'),
  bio: z.string().max(1000, 'Keep your bio under 1000 characters').optional(),
});

export type DoctorApplicationInput = z.infer<typeof doctorApplicationSchema>;
