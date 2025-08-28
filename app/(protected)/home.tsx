import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Button } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useCalculationsAll } from "@/features/calculations/hooks/useCalculationsAll";
import { CalculationList } from "@/features/calculations/components/CalculationList";

const QUICK = [
  { key: "BMR", icon: "flame" },
  { key: "TDEE", icon: "pulse" },
  { key: "MACROS", icon: "restaurant" },
  { key: "BMI", icon: "body" },
] as const;

export default function HomeScreen() {
  const { session } = useAuth();
  const userId = session?.user.id || "";
  const { data, isLoading, error, refetch } = useCalculationsAll(userId);
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");

  const recent = data?.data.slice(0, 5) || [];

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}> 
      <View style={styles.headerRow}>
        <ThemedText style={styles.section}>Recent Calculations</ThemedText>
        <Button title="See all" onPress={() => router.push("/(protected)/progress")} />
      </View>
      <CalculationList
        data={recent}
        isLoading={isLoading}
        error={error as Error | null}
        onRetry={refetch}
        onItemPress={(c) => router.push(`/(protected)/calculation/${c.id}`)}
      />

      <ThemedText style={styles.section}>Quick Actions</ThemedText>
      <View style={styles.quickGrid}>
        {QUICK.map((q) => (
          <TouchableOpacity
            key={q.key}
            style={[
              styles.quickCard,
              { backgroundColor: background, borderColor: text },
            ]}
            onPress={() =>
              router.push({
                pathname: "/(protected)/calculators",
                params: { type: q.key },
              })
            }
          >
            <Ionicons name={q.icon as any} size={28} color={text} />
            <ThemedText>{q.key}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <ThemedText style={styles.section}>Fitness Tip</ThemedText>
      <ThemedText>
        Your BMR represents the minimum calories your body needs to function at
        rest. Knowing this helps you create effective nutrition and fitness
        plans.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  quickCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
  },
});
