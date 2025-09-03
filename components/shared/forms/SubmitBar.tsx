import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { Colors } from "@/theme/constants/Colors";

export const SubmitBar: React.FC<{
  disabled?: boolean;
  loading?: boolean;
  label?: string;
}> = ({ disabled, loading, label = "Calculate" }) => {
  const scheme = useColorScheme() ?? "light";
  const tint = Colors[scheme].tint;
  const bg = tint;
  const fg = "#fff";

  return (
    <View style={styles.wrap}>
      <Pressable
        disabled={disabled || loading}
        style={[
          styles.btn,
          { backgroundColor: bg, opacity: disabled || loading ? 0.6 : 1 },
        ]}
        onPress={() => {}}
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
  wrap: { marginTop: 8 },
  btn: { borderRadius: 12, height: 48 },
  btnOverlay: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontSize: 16, fontWeight: "700" },
});
