import { Calculation } from "@/types/calculationTypes";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Pressable, StyleSheet, View } from "react-native";
import { Button } from "react-native";

interface Props {
  calculation: Calculation;
  onClick?: () => void;
  onDelete?: () => void;
}

export function CalculationCard({ calculation, onClick, onDelete }: Props) {
  const content = (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.type}>{calculation.type}</ThemedText>
      <ThemedText>{formatValue(calculation.value)}</ThemedText>
      <ThemedText style={styles.date}>
        {new Date(calculation.createdAt).toLocaleDateString()}
      </ThemedText>
      {onDelete && (
        <View style={styles.actions}>
          <Button title="Delete" onPress={onDelete} />
        </View>
      )}
    </ThemedView>
  );

  if (onClick) {
    return <Pressable onPress={onClick}>{content}</Pressable>;
  }
  return content;
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
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  type: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    marginTop: 4,
    fontSize: 12,
  },
  actions: {
    marginTop: 8,
  },
});
