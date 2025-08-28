import { CalculationType } from "./requests";

export interface Calculation {
  id: string;
  created_at: string; // ISO (keep snake_case to match backend)
  userId: string;
  type: CalculationType;
  result_json: Record<string, number | string | boolean | null>;
  input_json: Record<string, number | string | boolean | null>;
  goal: string | null;
}

export interface CalculationsByTypeResponse { data: Calculation[]; nextOffset?: number | null }
export interface CalculationsDeleteResponse { deleted: string[] }

export type CalculationsAllResponse = Calculation[];
export type CalculationsByDateResponse = Calculation[];
export type CalculationsByIdResponse = Calculation[];

export type CalculationsLatestResponse =
  | Record<string, Calculation | null>
  | { data: Record<string, Calculation | null> };
