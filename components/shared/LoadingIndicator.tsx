// components/ui/LoadingIndicator.tsx
import { Colors } from "@/theme/constants/Colors";
import { MotiView } from "moti";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Easing } from "react-native-reanimated";

type Props = {
  styleVariant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  size?: number;
  tint?: string;
  icon?: string;
};

export const LoadingIndicator: React.FC<Props> = ({
  styleVariant = 1,
  size = 40,
  tint = Colors.light.tint,
  icon = Colors.light.icon,
}) => {
  switch (styleVariant) {
    case 1:
      return <ActivityIndicator size="large" color={tint} />;

    case 2:
      return (
        <View style={styles.row}>
          {[0, 1, 2].map((i) => (
            <MotiView
              key={i}
              from={{ scale: 0.6, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                loop: true,
                delay: i * 150,
                type: "timing",
                duration: 600,
              }}
              style={[
                styles.dot,
                { backgroundColor: tint, width: size / 4, height: size / 4 },
              ]}
            />
          ))}
        </View>
      );

    case 3:
      return (
        <View style={styles.row}>
          {[0, 1, 2].map((i) => (
            <MotiView
              key={i}
              from={{ translateY: 0 }}
              animate={{ translateY: -10 }}
              transition={{
                loop: true,
                delay: i * 200,
                type: "timing",
                duration: 600,
              }}
              style={[
                styles.bar,
                { backgroundColor: tint, width: size / 6, height: size / 2 },
              ]}
            />
          ))}
        </View>
      );

    // inside LoadingIndicator.tsx switch

    // 4) Dual orbiting dots
    case 4:
      return (
        <View
          style={{
            width: size * 2,
            height: size * 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {[tint, icon].map((color, i) => (
            <MotiView
              key={i}
              from={{ rotate: "0deg" }}
              animate={{ rotate: "360deg" }}
              transition={{ loop: true, type: "timing", duration: 1600 }}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: size / 2,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: size / 3,
                  height: size / 3,
                  borderRadius: size / 6,
                  backgroundColor: color,
                  transform: [{ translateY: -size / 2 }],
                }}
              />
            </MotiView>
          ))}
        </View>
      );

    // 5) Ripple pulse
    case 5:
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <MotiView
              key={i}
              from={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ loop: true, delay: i * 400, duration: 1200 }}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: 2,
                borderColor: tint,
              }}
            />
          ))}
          <View
            style={{
              width: size / 2,
              height: size / 2,
              borderRadius: size / 4,
              backgroundColor: tint,
            }}
          />
        </View>
      );

    case 6:
      return (
        <MotiView
          from={{ width: size / 4 }}
          animate={{ width: size }}
          transition={{ loop: true, type: "timing", duration: 800 }}
          style={[styles.bar, { backgroundColor: tint, height: size / 6 }]}
        />
      );

    case 7:
      return (
        <View style={styles.row}>
          {[0, 1, 2].map((i) => (
            <MotiView
              key={i}
              from={{ scale: 1, backgroundColor: tint }}
              animate={{ scale: 1.2, backgroundColor: icon }}
              transition={{
                loop: true,
                delay: i * 200,
                type: "timing",
                duration: 600,
              }}
              style={[styles.dot, { width: size / 5, height: size / 5 }]}
            />
          ))}
        </View>
      );

    case 8:
      return (
        <MotiView
          from={{ rotate: "0deg" }}
          animate={{ rotate: "360deg" }}
          transition={{ loop: true, type: "timing", duration: 1000 }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderTopWidth: 4,
            borderRightWidth: 4,
            borderColor: tint,
            borderLeftColor: "transparent",
            borderBottomColor: "transparent",
          }}
        />
      );

    // 9) Heartbeat pulse
    case 9:
      return (
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: 1.4 }}
          transition={{
            loop: true,
            type: "timing",
            duration: 400,
            easing: Easing.inOut(Easing.ease),
          }}
          style={{
            width: size / 2,
            height: size / 2,
            borderRadius: size / 4,
            backgroundColor: tint,
          }}
        />
      );
    case 10:
      return (
        <View style={styles.row}>
          {[0, 1, 2, 3].map((i) => (
            <MotiView
              key={i}
              from={{ translateX: 0 }}
              animate={{ translateX: 10 }}
              transition={{
                loop: true,
                delay: i * 100,
                type: "timing",
                duration: 500,
              }}
              style={[
                styles.bar,
                {
                  backgroundColor: i % 2 === 0 ? tint : icon,
                  width: size / 6,
                  height: size / 2,
                },
              ]}
            />
          ))}
        </View>
      );

    default:
      return <ActivityIndicator size="large" color={tint} />;
  }
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    borderRadius: 50,
  },
  bar: {
    borderRadius: 6,
    marginHorizontal: 2,
  },
  circle: {
    borderRadius: 50,
  },
  spinner: {
    borderRadius: 50,
  },
});
