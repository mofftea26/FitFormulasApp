// features/home/components/recentSection/models.ts

export type CalcType = "BMR" | "TDEE" | "Macros" | "BMI" | "BodyComposition";

export interface BaseCalc<TType extends CalcType, TResult, TInput> {
  id: string;
  created_at: string; // ISO
  userId: string;
  type: TType;
  result_json: TResult;
  input_json: TInput;
  goal: string | null;
}

/** BMR */
export type BmrResult = {
  bmr: number;
  equation: "mifflin" | "harris" | string;
};
export type BmrInput = {
  age: number;
  gender: "male" | "female";
  equation: "mifflin" | "harris" | string;
  heightCm: number;
  weightKg: number;
};
export type BmrCalc = BaseCalc<"BMR", BmrResult, BmrInput>;

/** TDEE */
export type TdeeResult = { tdee: number };
export type TdeeInput = { bmr: number; activityLevel: string };
export type TdeeCalc = BaseCalc<"TDEE", TdeeResult, TdeeInput>;

/** Macros */
export type MacrosResult = {
  fat: number; // g
  carbs: number; // g
  protein: number; // g
  calories: number; // kcal
};
export type MacrosInput = {
  bmr: number;
  goal: string;
  weightKg: number;
  activityLevel: string;
};
export type MacrosCalc = BaseCalc<"Macros", MacrosResult, MacrosInput>;

/** BMI */
export type BmiResult = { bmi: number; category: string };
export type BmiInput = { heightCm: number; weightKg: number };
export type BmiCalc = BaseCalc<"BMI", BmiResult, BmiInput>;

/** Body Composition */
export type BodyCompositionResult = {
  fatMassKg: number;
  bodyFatPercent: number;
  leanBodyMassKg: number;
};
export type BodyCompositionInput = {
  hipCm: number;
  gender: "male" | "female";
  neckCm: number;
  waistCm: number;
  heightCm: number;
  weightKg: number;
};
export type BodyCompositionCalc = BaseCalc<
  "BodyComposition",
  BodyCompositionResult,
  BodyCompositionInput
>;

/** The full backend response shape */
export interface RecentCalculationsResponse {
  BMR?: BmrCalc;
  TDEE?: TdeeCalc;
  Macros?: MacrosCalc;
  BMI?: BmiCalc;
  BodyComposition?: BodyCompositionCalc;
}
