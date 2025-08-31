import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const background = useThemeColor({}, "background");

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: background }]}
    ></ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
});
