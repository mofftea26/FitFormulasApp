// features/home/components/quickactions/models.ts
import { Activity, Flame, Scale } from "lucide-react-native";

export type QuickActionType = "BMR" | "TDEE" | "BMI";

export const QUICK_ACTIONS: {
  type: QuickActionType;
  label: string;
  Icon: React.ComponentType<{ color?: string; size?: number }>;
}[] = [
  { type: "BMR", label: "BMR", Icon: Flame },
  { type: "TDEE", label: "TDEE", Icon: Activity },
  { type: "BMI", label: "BMI", Icon: Scale },
];
