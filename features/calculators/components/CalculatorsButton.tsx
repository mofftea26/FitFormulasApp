import { useTheme } from "@/theme";
import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
type IconProps = { color?: string; size?: number };
type IconComponent = React.ComponentType<IconProps>;

interface CalculatorsButtonProps {
  Icon: IconComponent;
  title: string;
  action: () => void;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function CalculatorsButton({
  Icon,
  title,
  action,
  color,
  size = 120,
  style,
  textStyle,
}: CalculatorsButtonProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const buttonColor = color || colors.tint;
  const iconSize = size * 0.4;
  const fontSize = size * 0.12;

  return (
    <Pressable
      onPress={action}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        { borderColor: buttonColor, minHeight: size },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.content,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        <Icon size={iconSize} color={color} />
        <Text
          style={[styles.title, { fontSize, color: colors.text }, textStyle]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    gap: 8,
  },
  title: { fontWeight: "600", textAlign: "center", lineHeight: 18 },
});
