// features/home/components/recentSection/RecentSection.tsx
import { ThemedText } from "@/components/ui/ThemedText";
import { capitalize, humanize, round1 } from "@/utils/helpers";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { CARD_COLORS } from "../../../constants/calculators/cardColors";
import { CARD_ICONS } from "../../../constants/calculators/cardIcons";
import { RecentCard } from "./components/RecentCard";
import { CalcType, RecentCalculationsResponse } from "./models";

export type RecentSectionProps = {
  title?: string;
  data: RecentCalculationsResponse;
  onCardPress?: (type: CalcType) => void; // open details / navigate
};

export const RecentSection: React.FC<RecentSectionProps> = ({
  title = "Recent Calculations",
  data,
  onCardPress,
}) => {
  // Map backend data → renderable card configs
  const cards = useMemo(() => {
    const arr: {
      type: CalcType;
      title: string;
      value: string;
      subtitle?: string;
    }[] = [];

    if (data.BMR) {
      arr.push({
        type: "BMR",
        title: "BMR",
        value: `${Math.round(data.BMR.result_json.bmr)} kcal`,
        subtitle: capitalize(data.BMR.result_json.equation || "Mifflin"),
      });
    }
    if (data.TDEE) {
      arr.push({
        type: "TDEE",
        title: "TDEE",
        value: `${Math.round(data.TDEE.result_json.tdee)} kcal`,
        subtitle: humanize(data.TDEE.input_json.activityLevel),
      });
    }
    if (data.BMI) {
      arr.push({
        type: "BMI",
        title: "BMI",
        value: `${round1(data.BMI.result_json.bmi)}`,
        subtitle: data.BMI.result_json.category,
      });
    }
    if (data.Macros) {
      const r = data.Macros.result_json;
      arr.push({
        type: "Macros",
        title: "Macros",
        value: `${r.protein}P • ${r.carbs}C • ${r.fat}F`,
        subtitle: `${r.calories} kcal`,
      });
    }
    if (data.BodyComposition) {
      const r = data.BodyComposition.result_json;
      arr.push({
        type: "BodyComposition",
        title: "Body Comp.",
        value: `${round1(r.bodyFatPercent)}% BF`,
        subtitle: `${round1(r.leanBodyMassKg)} kg LBM`,
      });
    }
    return arr;
  }, [data]);

  // Enforce layout: first row = BMR/TDEE/BMI (in this order), second row = Macros / BodyComposition
  const order: CalcType[] = ["BMR", "TDEE", "BMI", "Macros", "BodyComposition"];
  const mapByType = Object.fromEntries(cards.map((c) => [c.type, c]));

  const row1: CalcType[] = order.slice(0, 3).filter((t) => mapByType[t]);
  const row2: CalcType[] = order.slice(3).filter((t) => mapByType[t]);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>

      {/* Row 1: 3 horizontally aligned cards */}
      <View style={styles.row}>
        {row1.map((t) => {
          const c = mapByType[t];
          const Icon = CARD_ICONS[t];
          const color = CARD_COLORS[t];
          return (
            <RecentCard
              key={t}
              title={c.title}
              value={c.value}
              subtitle={c.subtitle}
              Icon={Icon}
              color={color}
              onPress={() => onCardPress?.(t)}
              style={styles.cardThird}
            />
          );
        })}
      </View>

      {/* Row 2: left macros, right body composition */}
      <View style={styles.row}>
        {row2.map((t, idx) => {
          const c = mapByType[t];
          const Icon = CARD_ICONS[t];
          const color = CARD_COLORS[t];
          return (
            <RecentCard
              key={t}
              title={c.title}
              value={c.value}
              subtitle={c.subtitle}
              Icon={Icon}
              color={color}
              onPress={() => onCardPress?.(t)}
              style={styles.cardHalf}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 8 },
  title: { fontSize: 18, fontWeight: "500", marginBottom: 2 },
  row: { flexDirection: "row", gap: 10 },
  cardThird: { flex: 1, minWidth: 0 },
  cardHalf: { flex: 1, minWidth: 0 },
});

export default RecentSection;
