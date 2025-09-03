// src/api/calculators/models.ts
import { z } from "zod";

/** Shared enums */
export type Gender = "male" | "female";
export type BmrEquation = "mifflin" | "harris" | "katch";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
export type Goal = "fatLoss" | "maintenance" | "muscleGain";

/** Inputs (client -> edge function) */
export type BmrReq = {
  userId: string;
  weightKg: number;
  heightCm?: number; // required for mifflin/harris
  age: number;
  gender: Gender;
  bodyFatPercent?: number; // required for katch
  equation: BmrEquation;
};

export type TdeeReq = {
  userId: string;
  bmr: number;
  activityLevel: ActivityLevel;
};

export type MacrosReq = {
  userId: string;
  weightKg: number;
  goal: Goal;
  /** Either provide tdee, or (bmr + activityLevel) */
  tdee?: number;
  bmr?: number;
  activityLevel?: ActivityLevel;
};

export type BmiReq = {
  userId: string;
  weightKg: number;
  heightCm: number;
};

export type BodyCompReq = {
  userId: string;
  weightKg: number;
  /** If omitted, EF will estimate via US Navy formula (needs gender/height/neck/waist[/hip]) */
  bodyFatPercent?: number;
  gender?: Gender;
  heightCm?: number;
  neckCm?: number;
  waistCm?: number;
  hipCm?: number; // required for females when estimating
};

/** Responses (edge function -> client) */
export const zBmrRes = z.object({
  bmr: z.number(),
  equation: z.enum(["mifflin", "harris", "katch"]),
});
export type BmrRes = z.infer<typeof zBmrRes>;

export const zTdeeRes = z.object({
  tdee: z.number(),
});
export type TdeeRes = z.infer<typeof zTdeeRes>;

export const zMacrosRes = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
});
export type MacrosRes = z.infer<typeof zMacrosRes>;

export const zBmiRes = z.object({
  bmi: z.number(),
  category: z.string(),
});
export type BmiRes = z.infer<typeof zBmiRes>;

export const zBodyCompRes = z.object({
  bodyFatPercent: z.number(),
  leanBodyMassKg: z.number(),
  fatMassKg: z.number(),
});
export type BodyCompRes = z.infer<typeof zBodyCompRes>;
