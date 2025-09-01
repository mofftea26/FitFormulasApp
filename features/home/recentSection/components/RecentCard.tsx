// features/home/components/recentSection/RecentCard.tsx
import { AutoSizeText } from "@/components/shared/AutoSizeText";
import { ThemedText } from "@/components/ui/ThemedText";
import React from "react";
import {
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type IconProps = { color?: string; size?: number };
type IconComponent = React.ComponentType<IconProps>;

export type RecentCardProps = {
  title: string;
  value: string; // e.g. "1694 kcal", "27.1 BMI"
  subtitle?: string; // e.g. "Mifflin", "Overweight"
  color: string; // fixed brand color for the card (border/text)
  Icon: IconComponent; // lucide icon component
  onPress?: () => void; // navigation / details
  style?: ViewStyle; // allow layout control from parent
  titleStyle?: TextStyle;
  valueStyle?: TextStyle;
  subtitleStyle?: TextStyle;
};

export const RecentCard: React.FC<RecentCardProps> = ({
  title,
  value,
  subtitle,
  color,
  Icon,
  onPress,
  style,
  titleStyle,
  valueStyle,
  subtitleStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: color, backgroundColor: color + "20" },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      <View style={styles.row}>
        <Icon color={color} size={20} />
        <ThemedText style={[styles.title, { color }, titleStyle]}>
          {title}
        </ThemedText>
      </View>

      <AutoSizeText
        text={value}
        style={[styles.value, { color }, valueStyle]}
        maxFontSize={22} // tweak max size
        minFontSize={12} // tweak min size
      />

      {subtitle ? (
        <ThemedText
          style={[styles.subtitle, { color }, subtitleStyle]}
          numberOfLines={1}
        >
          {subtitle}
        </ThemedText>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
    gap: 6,
    minHeight: 75,
    justifyContent: "center",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 13, fontWeight: "600", letterSpacing: 0.2 },
  value: { fontSize: 20, fontWeight: "700" },
  subtitle: { fontSize: 12, fontWeight: "500", opacity: 0.9 },
});
