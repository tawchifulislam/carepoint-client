import { z } from 'zod';

const timeOfDay = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:mm format');

export const createAvailabilitySchema = z.object({
  weekday: z.number().int().min(0).max(6),
  startTime: timeOfDay,
  endTime: timeOfDay,
  slotDurationMin: z.number().int().min(5).max(240),
  bufferMin: z.number().int().min(0).max(120),
});

export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;

export const createExceptionSchema = z.object({
  date: z.string().date(),
});

export type CreateExceptionInput = z.infer<typeof createExceptionSchema>;
