import { Calculation } from "@/types/calculationTypes";
import { format } from "../utils/formatters";
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
  calculation: Calculation;
  onPress?: () => void;
}

export function CalculationCard({ calculation, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.date}>{format.date(calculation.created_at)}</Text>
      <Text>{format.summary(calculation)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  date: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});
