// src/api/calculations/models.ts

// Your models (unchanged)
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

/** Full backend response for /calculations-latest */
export interface RecentCalculationsResponse {
  BMR?: BmrCalc;
  TDEE?: TdeeCalc;
  Macros?: MacrosCalc;
  BMI?: BmiCalc;
  BodyComposition?: BodyCompositionCalc;
}

// Convenience unions
export type AnyCalc =
  | BmrCalc
  | TdeeCalc
  | MacrosCalc
  | BmiCalc
  | BodyCompositionCalc;

// Requests
export type AllReq = { userId: string };
export type ByDateReq = { userId: string; startDate: string; endDate: string };
export type ByIdReq = { userId: string; ids: string[] };
export type LatestReq = { userId: string };
export type ByTypeReq = { userId: string; type: "BMR" | "TDEE" | "Macros" }; // allowedTypes in EF
export type DeleteReq = { userId: string; ids: string[] };

// Responses
export type AllRes = AnyCalc[];
export type ByDateRes = AnyCalc[];
export type ByIdRes = AnyCalc[];
export type LatestRes = RecentCalculationsResponse;
export type ByTypeRes = AnyCalc[]; // narrowed in client overloads
export type DeleteRes = { success: true };
