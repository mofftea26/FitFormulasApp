import { ThemedView } from "@/components/ui/ThemedView";
import { CARD_COLORS } from "@/constants/calculators/cardColors";
import { CARD_ICONS } from "@/constants/calculators/cardIcons";
import { CalculatorsButton } from "@/features/calculators/components/CalculatorsButton";
import React from "react";
import { StyleSheet } from "react-native";

export default function CalculatorsScreen() {
  return (
    <ThemedView style={styles.container}>
      <CalculatorsButton
        Icon={CARD_ICONS.BMR}
        color={CARD_COLORS.BMR}
        title="BMR"
        action={() => {
          console.log("BMR");
        }}
      />
      <CalculatorsButton
        Icon={CARD_ICONS.TDEE}
        color={CARD_COLORS.TDEE}
        title="TDEE"
        action={() => {
          console.log("TDEE");
        }}
      />
      <CalculatorsButton
        Icon={CARD_ICONS.Macros}
        color={CARD_COLORS.Macros}
        title="Macros"
        action={() => {
          console.log("Macros");
        }}
      />
      <CalculatorsButton
        Icon={CARD_ICONS.BodyComposition}
        color={CARD_COLORS.BodyComposition}
        title="Body Composition"
        action={() => {
          console.log("Body Composition");
        }}
      />
      <CalculatorsButton
        Icon={CARD_ICONS.BMI}
        color={CARD_COLORS.BMI}
        title="BMI"
        action={() => {
          console.log("BMI");
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
