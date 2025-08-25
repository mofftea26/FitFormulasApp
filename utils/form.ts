import { z } from 'zod';

export const bmrSchema = z.object({
  age: z.string().min(1, 'Age is required'),
  weight: z.string().min(1, 'Weight is required'), // kg
  height: z.string().min(1, 'Height is required'), // cm
  gender: z.enum(['male', 'female']),
  equation: z.enum(['mifflin', 'harris', 'katch']).default('mifflin'),
  bodyFatPercent: z.string().optional(),
});
export type BmrForm = z.infer<typeof bmrSchema>;

export const tdeeSchema = z.object({
  age: z.string().min(1, 'Age is required'),
  weight: z.string().min(1, 'Weight is required'),
  height: z.string().min(1, 'Height is required'),
  gender: z.enum(['male', 'female']),
  activity: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
});
export type TdeeForm = z.infer<typeof tdeeSchema>;

export const macrosSchema = z.object({
  weight: z.string().min(1, 'Weight is required'),
  goal: z.enum(['fatLoss', 'maintenance', 'muscleGain']),
  tdee: z.string().optional(),
  bmr: z.string().optional(),
  activity: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']).optional(),
});
export type MacrosForm = z.infer<typeof macrosSchema>;

export const bmiSchema = z.object({
  weight: z.string().min(1, 'Weight is required'),
  height: z.string().min(1, 'Height is required'),
});
export type BmiForm = z.infer<typeof bmiSchema>;

export const bodyCompSchema = z.object({
  weight: z.string().min(1, 'Weight is required'),
  bodyFatPercent: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  height: z.string().optional(),
  neck: z.string().optional(),
  waist: z.string().optional(),
  hip: z.string().optional(),
});
export type BodyCompForm = z.infer<typeof bodyCompSchema>;
