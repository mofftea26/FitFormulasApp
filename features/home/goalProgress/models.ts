// features/home/components/goalProgress/models.ts

/** Backend payload */
export interface ActiveGoal {
  id: string;
  userId: string;
  created_at: string; // ISO
  goal_type: "muscleGain" | "fatLoss" | "recomp" | string;
  target_weight: number | null; // kg
  target_body_fat: number | null; // %
  target_lbm: number | null; // kg
  target_date: string | null; // YYYY-MM-DD
  notes: string | null;
  completed: boolean;
  isactive: boolean;
}

export interface ActiveGoalResponse {
  activeGoal: ActiveGoal | null;
}

/** What we track visually */
export type GoalMetric = "weight" | "bodyFat" | "lbm";

export type GoalContext = {
  // Current readings (from profile / latest progress snapshot)
  currentWeightKg?: number;
  currentBodyFatPercent?: number;
  currentLeanBodyMassKg?: number;

  // Optional starting point (if you keep historical snapshots)
  startWeightKg?: number;
  startBodyFatPercent?: number;
  startLeanBodyMassKg?: number;
};

/** Card-friendly data */
export interface GoalProgressData {
  title: string; // e.g. "Muscle Gain • Weight"
  subtitle?: string; // e.g. "Bulking phase • By Dec 31, 2025 (X days left)"
  unit: string; // "kg" | "%"
  start?: number; // optional for proper progress %
  current?: number; // displayed if provided
  target: number; // from backend target_*
  direction: "increase" | "decrease";
}

/** Compute % (0..100).
 * If start is provided: classic (current-start)/(target-start).
 * If start is missing: proximity to target (clamped).
 * Handles both increase (gain) and decrease (loss) directions.
 */
export const computePercent = (args: {
  start?: number;
  current?: number;
  target: number;
  direction: "increase" | "decrease";
}) => {
  const { start, current, target, direction } = args;

  // No current reading -> 0% (unknown)
  if (typeof current !== "number" || isNaN(current)) return 0;

  if (typeof start === "number" && !isNaN(start) && start !== target) {
    const num = direction === "increase" ? current - start : start - current;
    const den = direction === "increase" ? target - start : start - target;
    const pct = (num / den) * 100;
    return clamp(Math.round(pct), 0, 100);
  }

  // Fallback: proximity to target (no start value)
  const diff = Math.abs(target - current);
  const scale = Math.max(Math.abs(target), 1);
  const pct = 100 - (diff / scale) * 100;
  return clamp(Math.round(pct), 0, 100);
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export const goalTypeLabel = (t: ActiveGoal["goal_type"]) => {
  switch (t) {
    case "muscleGain":
      return "Muscle Gain";
    case "fatLoss":
      return "Fat Loss";
    case "recomp":
      return "Recomposition";
    default:
      return (
        t?.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()) ||
        "Goal"
      );
  }
};

export const formatTargetDate = (iso?: string | null) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (isNaN(+date)) return null;
  const now = new Date();
  const ms = date.getTime() - now.getTime();
  const daysLeft = Math.ceil(ms / (1000 * 60 * 60 * 24));
  const nice = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return `${nice}${daysLeft >= 0 ? ` • ${daysLeft} days left` : ""}`;
};

/** Pick metric by available target in priority: weight -> bodyFat -> lbm */
export const deriveMetric = (
  g: ActiveGoal | null
): {
  metric: GoalMetric;
  unit: "kg" | "%";
  target: number;
} | null => {
  if (!g) return null;
  if (typeof g.target_weight === "number")
    return { metric: "weight", unit: "kg", target: g.target_weight };
  if (typeof g.target_body_fat === "number")
    return { metric: "bodyFat", unit: "%", target: g.target_body_fat };
  if (typeof g.target_lbm === "number")
    return { metric: "lbm", unit: "kg", target: g.target_lbm };
  return null;
};

/** Direction heuristic:
 * - bodyFat always "decrease"
 * - lbm always "increase"
 * - weight: increase for muscleGain, decrease for fatLoss; default increase
 */
export const directionFor = (
  metric: GoalMetric,
  goalType: ActiveGoal["goal_type"]
): "increase" | "decrease" => {
  if (metric === "bodyFat") return "decrease";
  if (metric === "lbm") return "increase";
  if (metric === "weight") {
    if (goalType === "fatLoss") return "decrease";
    return "increase";
  }
  return "increase";
};
