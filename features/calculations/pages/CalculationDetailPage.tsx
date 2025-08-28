import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { useCalculationsById } from "../hooks/useCalculationsById";
import { StyleSheet } from "react-native";

export function CalculationDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const userId = session?.user.id || "";
  const { data, isLoading, error } = useCalculationsById(userId, [id]);
  const calc = data?.data[0];

  if (isLoading)
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  if (error)
    return (
      <ThemedView style={styles.center}>
        <ThemedText>{error.message}</ThemedText>
      </ThemedView>
    );
  if (!calc)
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Not found</ThemedText>
      </ThemedView>
    );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{calc.type}</ThemedText>
      <ThemedText>{JSON.stringify(calc.value)}</ThemedText>
      <ThemedText>
        {new Date(calc.createdAt).toLocaleString()}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
