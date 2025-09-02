// components/ui/TopBarLoader.tsx
import { useThemeColor } from "@/hooks/useThemeColor";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

type Props = {
  active: boolean;
  height?: number;
  trackOpacity?: number;
  /** Absolute offsets so you can full-bleed (e.g., left=0,right=0, top=safeAreaTop) */
  top?: number;
  left?: number;
  right?: number;
};

export const TopBarLoader: React.FC<Props> = ({
  active,
  height = 3,
  trackOpacity = 0.15,
  top = 0,
  left = 16, // default aligns with your page padding
  right = 16, // default aligns with your page padding
}) => {
  const tint = useThemeColor({}, "tint");
  const { width } = useWindowDimensions();

  if (!active) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.container, { top, left, right, height }]}
      accessibilityRole="progressbar"
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: tint,
            opacity: trackOpacity,
            borderRadius: height / 2,
          },
        ]}
      />
      <MotiView
        from={{ translateX: -width * 0.5 }}
        animate={{ translateX: width }}
        transition={{ loop: true, type: "timing", duration: 1000 }}
        style={{
          position: "absolute",
          height,
          width: width * 0.3,
          backgroundColor: tint,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
});
