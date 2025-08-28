import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { Button, StyleSheet, TextInput } from "react-native";
import { useCalculationsByType } from "../hooks/useCalculationsByType";
import { useDeleteCalculations } from "../hooks/useDeleteCalculations";
import { CalculationList } from "../components/CalculationList";
import { useState } from "react";
import { useCalculationsByDate } from "../hooks/useCalculationsByDate";
import { Calculation } from "@/types/calculationTypes";

export function CalculationHistoryPage() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { session } = useAuth();
  const userId = session?.user.id || "";

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [useDateFilter, setUseDateFilter] = useState(false);

  const history = useCalculationsByType(userId, type as any);
  const dateFiltered = useCalculationsByDate(userId, from, to);
  const del = useDeleteCalculations(userId, type);

  const data = useDateFilter
    ? dateFiltered.data?.data
    : history.data?.pages.flatMap((p) => p.data) ?? [];

  const isLoading = useDateFilter
    ? dateFiltered.isLoading
    : history.isLoading;

  const error = useDateFilter ? dateFiltered.error : (history.error as Error | null);

  const loadMore = () => {
    if (history.hasNextPage) history.fetchNextPage();
  };

  const onDelete = (id: string) => {
    del.mutate([id]);
  };

  const applyFilter = () => {
    setUseDateFilter(true);
    dateFiltered.refetch();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{type} History</ThemedText>

      <ThemedView style={styles.filterRow}>
        <TextInput
          placeholder="From (YYYY-MM-DD)"
          value={from}
          onChangeText={setFrom}
          style={styles.input}
        />
        <TextInput
          placeholder="To (YYYY-MM-DD)"
          value={to}
          onChangeText={setTo}
          style={styles.input}
        />
        <Button title="Apply" onPress={applyFilter} />
      </ThemedView>

      <CalculationList
        data={data as Calculation[]}
        isLoading={isLoading}
        error={error as Error | null}
        onDelete={onDelete}
        onItemPress={(c) => router.push(`/(protected)/calculation/${c.id}`)}
        onRetry={() => (useDateFilter ? dateFiltered.refetch() : history.refetch())}
      />

      {!useDateFilter && history.hasNextPage && (
        <Button title="Load more" onPress={loadMore} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  filterRow: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 8,
    padding: 4,
  },
});
