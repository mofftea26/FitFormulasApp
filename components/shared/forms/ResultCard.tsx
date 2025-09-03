import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

import { Colors } from "@/theme/constants/Colors";
import { CheckCircle2 } from "lucide-react-native";

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.kvLabel}>{label}</Text>
    <Text style={styles.kvValue}>{value}</Text>
  </View>
);

export const ResultCard: React.FC<{
  title: string;
  rows: { label: string; value: string }[];
}> = ({ title, rows }) => {
  const scheme = useColorScheme() ?? "light";
  const text = Colors[scheme].text;
  const icon = Colors[scheme].icon;

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <CheckCircle2 size={18} color={icon} />
        <Text style={[styles.title, { color: text }]}>{title}</Text>
      </View>
      {rows.map((r) => (
        <Row key={r.label} {...r} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: { fontWeight: "700", fontSize: 16 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  kvLabel: { opacity: 0.7 },
  kvValue: { fontWeight: "700" },
});
