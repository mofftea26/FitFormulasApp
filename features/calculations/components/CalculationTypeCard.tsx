import { Calculation, CalculationType } from "@/types/calculationTypes";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Pressable, StyleSheet } from "react-native";

interface Props {
  type: CalculationType;
  latestCalculation: Calculation | null | undefined;
  onClick: () => void;
}

export function CalculationTypeCard({ type, latestCalculation, onClick }: Props) {
  return (
    <Pressable onPress={onClick} style={{ flex: 1 }}>
      <ThemedView style={styles.card}>
        <ThemedText style={styles.type}>{type}</ThemedText>
        {latestCalculation ? (
          <ThemedText>{formatValue(latestCalculation.value)}</ThemedText>
        ) : (
          <ThemedText>No data</ThemedText>
        )}
      </ThemedView>
    </Pressable>
  );
}

function formatValue(value: Record<string, number | string>) {
  const entries = Object.entries(value);
  if (!entries.length) return "-";
  return entries
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  type: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});
