import { Calculation, CalculationType } from "@/types/calculationTypes";
import { typeColor } from "../colors/typeColors";
import { format } from "../utils/formatters";
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
  type: CalculationType;
  latest: Calculation | null | undefined;
  onPress: () => void;
}

export function CalculationTypeCard({ type, latest, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={[styles.title, { color: typeColor[type] }]}>{type}</Text>
      {latest ? (
        <>
          <Text>{format.summary(latest)}</Text>
          <Text style={styles.date}>{format.date(latest.created_at)}</Text>
        </>
      ) : (
        <Text>No data</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    marginTop: 4,
    fontSize: 12,
  },
});
