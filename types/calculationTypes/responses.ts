export type CalculationType =
  | "BMR"
  | "TDEE"
  | "MACROS"
  | "BMI"
  | "BODY_COMPOSITION"
  | "OTHER";

export interface Calculation {
  id: string;
  userId: string;
  type: CalculationType;
  value: Record<string, number | string>;
  createdAt: string;
  meta?: Record<string, unknown>;
}

export interface CalculationsAllResponse { data: Calculation[] }
export interface CalculationsByDateResponse { data: Calculation[] }
export interface CalculationsByIdResponse { data: Calculation[] }
export interface CalculationsLatestResponse { data: Record<CalculationType, Calculation | null> }
export interface CalculationsByTypeResponse { data: Calculation[]; nextOffset?: number | null }
export interface CalculationsDeleteResponse { deleted: string[] }
