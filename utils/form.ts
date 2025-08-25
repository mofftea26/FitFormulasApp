import { z } from 'zod';

export const bmrSchema = z.object({
  age: z.string().min(1, 'Age is required'),
  weight: z.string().min(1, 'Weight is required'), // kg
  height: z.string().min(1, 'Height is required'), // cm
  gender: z.enum(['male', 'female']),
});

export type BmrForm = z.infer<typeof bmrSchema>;
