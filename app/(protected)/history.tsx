import { useAuth } from "@/contexts/AuthContext";
import { useUserCalculations } from "@/hooks/queries/useUserCalculations";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function HistoryScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const {
    data: calculations,
    isLoading,
    error,
  } = useUserCalculations(userId || "");

  if (isLoading) return <ThemedText>Loading...</ThemedText>;
  if (error) return <ThemedText>Error loading history: {error.message}</ThemedText>;
  if (!calculations?.length) return <ThemedText>No calculations found.</ThemedText>;

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  return (
    <ThemedView style={[styles.container, { backgroundColor }] }>
      <ThemedText style={styles.title}>📄 History</ThemedText>
      <FlatList
        data={calculations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={[styles.item, { borderColor: textColor + '30' }] }>
            <ThemedText style={styles.type}>{item.type}</ThemedText>
            <ThemedText>Date: {new Date(item.createdAt).toLocaleDateString()}</ThemedText>
            <ThemedText>Result: {JSON.stringify(item.resultJson)}</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  type: { fontSize: 18, fontWeight: "600" },
});
