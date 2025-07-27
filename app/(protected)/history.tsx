import { useAuth } from "@/contexts/AuthContext";
import { useUserCalculations } from "@/hooks/queries/useUserCalculations";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function HistoryScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const {
    data: calculations,
    isLoading,
    error,
  } = useUserCalculations(userId || "");

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading history: {error.message}</Text>;
  if (!calculations?.length) return <Text>No calculations found.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 History</Text>
      <FlatList
        data={calculations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.type}>{item.type}</Text>
            <Text>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text>Result: {JSON.stringify(item.resultJson)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  type: { fontSize: 18, fontWeight: "600" },
});
