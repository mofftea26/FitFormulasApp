// features/home/components/tipsSection/TipsSection.tsx
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TipRotator } from "./components/TipRotator";
import { FITNESS_TIPS } from "./tips";

type Props = {
  title?: string;
};

export const TipsSection: React.FC<Props> = ({ title = "Tips" }) => {
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");

  return (
    <View style={[styles.card, { borderColor: icon }]}>
      <TipRotator tips={FITNESS_TIPS} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "transparent",
    gap: 12,
  },
});
