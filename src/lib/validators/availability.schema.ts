import { z } from 'zod';
import { toMinutes } from '@/lib/schedule';

const timeOfDay = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Enter a valid time');

export const availabilityFormSchema = z
  .object({
    weekdays: z
      .array(z.number().int().min(0).max(6))
      .min(1, 'Select at least one day'),
    startTime: timeOfDay,
    endTime: timeOfDay,
    slotDurationMin: z.number().int().min(5).max(240),
    bufferMin: z.number().int().min(0).max(120),
  })
  .refine(value => value.endTime > value.startTime, {
    message: 'End time must be after the start time',
    path: ['endTime'],
  })
  .refine(
    value =>
      toMinutes(value.endTime) - toMinutes(value.startTime) >=
      value.slotDurationMin,
    {
      message: 'This window is shorter than one slot',
      path: ['slotDurationMin'],
    },
  );

export type AvailabilityFormInput = z.infer<typeof availabilityFormSchema>;

export const leaveDaySchema = z.object({
  date: z.string().date('Select a date'),
});

export type LeaveDayInput = z.infer<typeof leaveDaySchema>;
