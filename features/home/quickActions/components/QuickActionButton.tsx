// features/home/components/quickactions/QuickActionButton.tsx
import { ThemedText } from "@/components/ui/ThemedText";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, View, ViewStyle } from "react-native";

type IconProps = { color?: string; size?: number };
type IconComponent = React.ComponentType<IconProps>;

export type QuickActionButtonProps = {
  label: string;
  Icon: IconComponent;
  tintColor: string; // use theme tint for both text & icon
  borderColor: string; // use theme "icon" or subtle border
  onPress?: () => void;
  style?: ViewStyle;
};

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  label,
  Icon,
  tintColor,
  borderColor,
  onPress,
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  const animateOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPressIn={animateIn}
        onPressOut={animateOut}
        onPress={onPress}
        style={({ pressed }) => [
          styles.btn,
          { borderColor: tintColor, backgroundColor: "transparent" },
          pressed && { opacity: 0.9 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <View style={styles.row}>
          <Icon color={tintColor} size={15} />
          <ThemedText
            style={[styles.label, { color: tintColor }]}
            numberOfLines={1}
          >
            {label}
          </ThemedText>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 12,
    justifyContent: "center",
    minHeight: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  label: { fontSize: 13, fontWeight: "700", letterSpacing: 0.2 },
});
