import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { CalculationType, CalculationsLatestResponse, Calculation } from "@/types/calculationTypes";
import { CalculationTypeCard } from "../components/CalculationTypeCard";
import { useCalculationsLatest } from "../hooks/useCalculationsLatest";
import { router } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

const TYPES: CalculationType[] = [
  "BMR",
  "TDEE",
  "MACROS",
  "BMI",
  "BODY_COMPOSITION",
  "OTHER",
];

export function ProgressPage() {
  const { session } = useAuth();
  const userId = session?.user.id || "";
  const { data, isLoading, error } = useCalculationsLatest(userId);

  if (isLoading)
    return (
      <ThemedView style={styles.center}>\n        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  if (error)
    return (
      <ThemedView style={styles.center}>
        <ThemedText>{error.message}</ThemedText>
      </ThemedView>
    );

  const latest = (data?.data ?? {}) as Record<CalculationType, Calculation | null>;

  return (
  <ScrollView contentContainerStyle={styles.container}>
    {TYPES.map((t) => (
        <CalculationTypeCard
          key={t}
          type={t}
          latestCalculation={latest[t] ?? null}
          onClick={() => router.push(`/(protected)/calculations/${t}`)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
