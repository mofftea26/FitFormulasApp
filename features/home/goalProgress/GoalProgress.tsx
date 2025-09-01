// features/home/components/goalProgress/GoalProgressSection.tsx
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { GoalProgressCard } from "./components/GoalProgressCard";
import {
  ActiveGoalResponse,
  deriveMetric,
  directionFor,
  formatTargetDate,
  GoalContext,
  GoalProgressData,
  goalTypeLabel,
} from "./models";

type Props = {
  title?: string;
  response: ActiveGoalResponse; // backend response you shared
  ctx?: GoalContext; // optional: pass current/start values
};

export const GoalProgressSection: React.FC<Props> = ({
  title = "Goal Progress",
  response,
  ctx,
}) => {
  const data: GoalProgressData | null = useMemo(() => {
    const g = response?.activeGoal ?? null;
    const derived = deriveMetric(g);
    if (!g || !derived) return null;

    const { metric, unit, target } = derived;

    const current =
      metric === "weight"
        ? ctx?.currentWeightKg
        : metric === "bodyFat"
        ? ctx?.currentBodyFatPercent
        : ctx?.currentLeanBodyMassKg;

    const start =
      metric === "weight"
        ? ctx?.startWeightKg
        : metric === "bodyFat"
        ? ctx?.startBodyFatPercent
        : ctx?.startLeanBodyMassKg;

    const dir = directionFor(metric, g.goal_type);

    const titleText = `${goalTypeLabel(g.goal_type)} • ${
      metric === "weight"
        ? "Weight"
        : metric === "bodyFat"
        ? "Body Fat"
        : "Lean Body Mass"
    }`;

    const pieces = [
      g.notes || undefined,
      g.target_date ? `By ${formatTargetDate(g.target_date)}` : undefined,
    ].filter(Boolean);

    return {
      title: titleText,
      subtitle: pieces.join(" • "),
      unit,
      start,
      current,
      target,
      direction: dir,
    } satisfies GoalProgressData;
  }, [response, ctx]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>

      {data ? (
        <GoalProgressCard data={data} />
      ) : (
        <ThemedView style={styles.emptyCard} accessibilityRole="summary">
          <ThemedText style={styles.emptyTitle}>No active goal</ThemedText>
          <ThemedText style={styles.emptySub}>
            Set a goal to start tracking progress.
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { gap: 8 },
  title: { fontSize: 18, fontWeight: "500" },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    borderColor: "rgba(180,180,180,0.35)",
    backgroundColor: "transparent",
  },
  emptyTitle: { fontSize: 14, fontWeight: "700", opacity: 0.9 },
  emptySub: { fontSize: 12, fontWeight: "600", opacity: 0.7, marginTop: 4 },
});
