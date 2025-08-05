export type CalculationType = "BMR" | "TDEE" | "Macros";

export interface Calculation {
  id: string;
  createdAt: string;
  userId: string;
  type: CalculationType;
  resultJson: Record<string, any>;
  inputJson?: Record<string, any>;
}

// BMR Calculation Input Types
export type BmrEquation = "mifflin" | "harris" | "katch";

export interface BmrRequest {
  weightKg: number;
  heightCm?: number; // required for mifflin and harris
  age: number;
  gender: "male" | "female";
  bodyFatPercent?: number; // required for katch
  equation: BmrEquation;
}

// TDEE Calculation Input
export interface TdeeRequest {
  bmr: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
}

// Macros Calculation Input
export interface MacrosRequest {
  tdee: number;
  weightKg: number;
  goal: "fatLoss" | "maintenance" | "muscleGain";
}
