import { Colors } from "@/theme/constants/Colors";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  onPress?: () => void; // ⬅️ add this
};

export const SubmitBar: React.FC<Props> = ({
  disabled,
  loading,
  label = "Calculate",
  onPress, // ⬅️ receive it
}) => {
  const scheme = useColorScheme() ?? "light";
  const tint = Colors[scheme].tint;
  const bg = tint;
  const fg = "#fff";
  const isDisabled = !!(disabled || loading);

  return (
    <View style={styles.wrap}>
      <Pressable
        disabled={isDisabled}
        onPress={onPress} // ⬅️ use it
        hitSlop={10}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: bg,
            opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
          },
        ]}
        collapsable={false}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: !!loading }}
      />
      <View pointerEvents="none" style={styles.btnOverlay}>
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <Text style={[styles.btnText, { color: fg }]}>{label}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginTop: 8, alignSelf: "stretch" },
  btn: { borderRadius: 12, height: 48 },
  btnOverlay: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontSize: 16, fontWeight: "700" },
});
