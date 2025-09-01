// features/home/components/goalProgress/GoalProgressCard.tsx
import { useThemeColor } from "@/hooks/useThemeColor";
import { Target } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GoalProgressData, computePercent } from "../models";
import { ProgressBar } from "./ProgressBar";

type Props = {
  data: GoalProgressData;
};

export const GoalProgressCard: React.FC<Props> = ({ data }) => {
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");

  const pct = computePercent({
    start: data.start,
    current: data.current,
    target: data.target,
    direction: data.direction,
  });

  return (
    <View
      style={[
        styles.card,
        { borderColor: icon, backgroundColor: "transparent" },
      ]}
      accessibilityRole="summary"
      accessibilityLabel={`${data.title} progress ${pct}%`}
    >
      {/* Header: icon + title + % */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Target size={18} color={tint} />
          <Text style={[styles.title, { color: icon }]} numberOfLines={1}>
            {data.title}
          </Text>
        </View>

        <Text style={[styles.percent, { color: tint }]}>{pct}%</Text>
      </View>

      {data.subtitle ? (
        <Text
          style={[styles.subtitle, { color: icon, opacity: 0.9 }]}
          numberOfLines={1}
        >
          {data.subtitle}
        </Text>
      ) : null}

      {/* Progress bar */}
      <View style={{ marginTop: 10 }}>
        <ProgressBar
          percent={pct}
          trackColor={"rgba(255,255,255,0.08)"}
          fillColor={tint}
        />
      </View>

      {/* Footer: numbers */}
      <View style={styles.footer}>
        <Text style={[styles.meta, { color: icon }]}>
          {formatValue(data.current ?? 0, data.unit)}{" "}
          <Text style={{ opacity: 0.7 }}>/</Text>{" "}
          {formatValue(data.target, data.unit)}
        </Text>
        {typeof data.start === "number" && (
          <Text style={[styles.meta, { color: icon, opacity: 0.85 }]}>
            Start: {formatValue(data.start, data.unit)}
          </Text>
        )}
      </View>
    </View>
  );
};

// ——— helpers ———
const formatValue = (v: number, unit?: string) =>
  typeof v === "number"
    ? `${stripTrailingZeros(v)}${unit ? ` ${unit}` : ""}`
    : "-";

const stripTrailingZeros = (n: number) => {
  const s = n.toFixed(2);
  return s.endsWith("00") ? Math.round(n).toString() : s.replace(/\.0$/, "");
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "700", letterSpacing: 0.2 },
  percent: { fontSize: 16, fontWeight: "800" },
  subtitle: { fontSize: 12, fontWeight: "600" },
  footer: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: { fontSize: 12, fontWeight: "600" },
});
