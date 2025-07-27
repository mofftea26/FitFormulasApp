import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BMRForm from "../../components/calculators/BMRForm";
import TDEEForm from "../../components/calculators/TDEEForm";

const CALCULATIONS = ["BMR", "TDEE", "Macros"] as const;
type CalcType = (typeof CALCULATIONS)[number];

export default function CalculatorsScreen() {
  const [selected, setSelected] = useState<CalcType | null>(null);

  const renderForm = () => {
    switch (selected) {
      case "BMR":
        return <BMRForm />;
      case "TDEE":
        return <TDEEForm />;
      case "Macros":
        return <Text>Macros Form Coming Soon</Text>;
      default:
        return (
          <View>
            <Text style={styles.title}>🧠 Choose a calculation:</Text>
            {CALCULATIONS.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.card}
                onPress={() => setSelected(type)}
              >
                <Text style={styles.cardText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
    }
  };

  return <View style={styles.container}>{renderForm()}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
