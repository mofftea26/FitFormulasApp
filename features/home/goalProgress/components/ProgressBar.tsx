// features/home/components/goalProgress/ProgressBar.tsx
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type Props = {
  percent: number; // 0..100
  height?: number; // bar height
  trackColor?: string; // faint track color
  fillColor?: string; // fill color (use theme tint)
  rounded?: boolean;
};

export const ProgressBar: React.FC<Props> = ({
  percent,
  height = 10,
  trackColor = "rgba(255,255,255,0.08)",
  fillColor = "#22c55e",
  rounded = true,
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: Math.max(0, Math.min(100, percent)),
      duration: 450,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const radius = rounded ? height / 2 : 0;

  const widthInterpolate = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: radius, backgroundColor: trackColor },
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: fillColor,
            borderRadius: radius,
            width: widthInterpolate,
            height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: { width: "100%", overflow: "hidden" },
  fill: {},
});
