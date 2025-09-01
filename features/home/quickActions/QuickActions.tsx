// features/home/components/quickactions/QuickActions.tsx
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { QuickActionButton } from "./components/QuickActionButton";
import { QUICK_ACTIONS, QuickActionType } from "./models";

export type QuickActionsProps = {
  title?: string;
  onPress?: (type: QuickActionType) => void; // optional override
};

export const QuickActions: React.FC<QuickActionsProps> = ({
  title = "Quick Actions",
  onPress,
}) => {
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Title + View all */}
      <View style={styles.header}>
        <ThemedText style={[styles.title]}>{title}</ThemedText>

        <TouchableOpacity
          onPress={() => {
            // go to calculators tab
            router.push("/calculators");
          }}
          style={styles.viewAll}
          accessibilityRole="button"
          accessibilityLabel="View all calculators"
        >
          <ThemedText style={[styles.viewAllText, { color: tint }]}>
            View all
          </ThemedText>
          <ChevronRight size={16} color={tint} />
        </TouchableOpacity>
      </View>

      {/* One horizontal row with 3 buttons */}
      <View style={styles.row}>
        {QUICK_ACTIONS.map(({ type, label, Icon }) => (
          <QuickActionButton
            key={type}
            label={label}
            Icon={Icon}
            tintColor={icon}
            borderColor={icon}
            onPress={() => {
              if (onPress) onPress(type);
              else console.log(`[QuickAction] Go to calculator: ${type}`);
            }}
            style={styles.item}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "500", flex: 1 },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  viewAllText: { fontSize: 13, fontWeight: "700", letterSpacing: 0.2 },
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "stretch",
  },
  item: {
    flex: 1,
    minWidth: 0,
  },
});

export default QuickActions;
