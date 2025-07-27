export type CalculationType = "BMR" | "TDEE" | "Macros";

export interface Calculation {
  id: string;
  createdAt: string;
  userId: string;
  type: CalculationType;
  resultJson: Record<string, any>;
  inputJson?: Record<string, any>;
}
