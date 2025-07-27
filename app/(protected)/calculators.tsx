import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import BMRForm from "../../components/calculators/BMRForm";
import TDEEForm from "../../components/calculators/TDEEForm";

const CALCULATIONS = ["BMR", "TDEE", "Macros"] as const;
type CalcType = (typeof CALCULATIONS)[number];

export default function CalculatorsScreen() {
  const [selected, setSelected] = useState<CalcType | null>(null);

  const backgroundColor = useThemeColor({}, "background");
  const renderForm = () => {
    switch (selected) {
      case "BMR":
        return <BMRForm />;
      case "TDEE":
        return <TDEEForm />;
      case "Macros":
        return <ThemedText>Macros Form Coming Soon</ThemedText>;
      default:
        return (
          <ThemedView>
            <ThemedText style={styles.title}>
              🧠 Choose a calculation:
            </ThemedText>
            {CALCULATIONS.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.card, { backgroundColor }]}
                onPress={() => setSelected(type)}
              >
                <ThemedText style={styles.cardText}>{type}</ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        );
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {renderForm()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
