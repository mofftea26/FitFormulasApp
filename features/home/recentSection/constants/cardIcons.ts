import { Activity, Flame, Scale, Utensils, Weight } from "lucide-react-native";

export const CARD_ICONS = {
  BMR: Flame,
  TDEE: Activity,
  BMI: Scale,
  Macros: Utensils,
  BodyComposition: Weight,
} as const;
