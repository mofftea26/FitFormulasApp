import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { Colors } from "@/theme/constants/Colors";
import { LucideIcon } from "lucide-react-native";

export type ChipOption<T extends string> = {
  value: T;
  label: string;
  Icon?: LucideIcon;
};

type Props<T extends string> = {
  value: T;
  onChange: (v: T) => void;
  options: ChipOption<T>[];
};

export function EnumChips<T extends string>({
  value,
  onChange,
  options,
}: Props<T>) {
  const scheme = useColorScheme() ?? "light";
  const tint = Colors[scheme].tint;
  const text = Colors[scheme].text;
  const icon = Colors[scheme].icon;

  const selectedScale = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1.03) }],
  }));

  const defaultScale = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1) }],
  }));

  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const selected = opt.value === value;

        return (
          <Animated.View
            key={opt.value}
            style={[
              styles.chip,
              selected ? selectedScale : defaultScale,
              { borderColor: selected ? tint : icon },
            ]}
          >
            <Pressable style={styles.press} onPress={() => onChange(opt.value)}>
              {opt.Icon ? (
                <opt.Icon
                  size={16}
                  color={selected ? tint : icon}
                  style={{ marginRight: 6 }}
                />
              ) : null}
              <Text
                style={{
                  color: selected ? tint : text,
                  fontWeight: selected ? "700" : "500",
                }}
              >
                {opt.label}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderRadius: 999, overflow: "hidden" },
  press: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});
