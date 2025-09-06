import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { CheckCircle2 } from "lucide-react-native";

const Row: React.FC<{ label: string; value: string; color?: string }> = ({
  label,
  value,
  color,
}) => (
  <View style={styles.row}>
    <Text style={[styles.kvLabel, { color: color }]}>{label}</Text>
    <Text style={[styles.kvValue, { color: color }]}>{value}</Text>
  </View>
);

export const ResultCard: React.FC<{
  title: string;
  rows: { label: string; value: string }[];
  color?: string;
}> = ({ title, rows, color }) => {
  return (
    <View style={[styles.card, { borderColor: color }]}>
      <View style={styles.titleRow}>
        <CheckCircle2 size={18} color={color} />
        <Text style={[styles.title, { color: color }]}>{title}</Text>
      </View>
      {rows.map((r) => (
        <Row key={r.label} {...r} color={color} />
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
