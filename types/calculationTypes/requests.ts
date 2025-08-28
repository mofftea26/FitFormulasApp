import { CalculationType } from "./responses";

export type CalculationsAllRequest = { userId: string };
export type CalculationsByDateRequest = { userId: string; from: string; to: string };
export type CalculationsByIdRequest = { userId: string; ids: string[] };
export type CalculationsLatestRequest = { userId: string };
export type CalculationsByTypeRequest = {
  userId: string;
  type: CalculationType;
  limit?: number;
  offset?: number;
};
export type CalculationsDeleteRequest = { userId: string; ids: string[] };
