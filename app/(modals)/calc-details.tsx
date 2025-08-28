import { ScrollView, Text, Button } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useUserId } from "@/hooks/useUserId";
import { useCalculationsById } from "@/features/calculations/hooks/useCalculationsById";
import { useDeleteCalculations } from "@/features/calculations/hooks/useDeleteCalculations";
import { LoadingState } from "@/features/calculations/components/LoadingState";
import { ErrorState } from "@/features/calculations/components/ErrorState";
import { EmptyState } from "@/features/calculations/components/EmptyState";
import { format } from "@/features/calculations/utils/formatters";

export default function CalcDetailsModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = useUserId();
  const { data, isLoading, error } = useCalculationsById(userId, id ? [id] : []);
  const calc = data?.[0];
  const del = useDeleteCalculations(userId);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} />;
  if (!calc) return <EmptyState />;

  const handleDelete = () => {
    del.mutate([calc.id], {
      onSuccess: () => router.back(),
    });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{calc.type}</Text>
      <Text>{format.date(calc.created_at)}</Text>

      <Text style={{ marginTop: 12, fontWeight: "bold" }}>Result</Text>
      {Object.entries(calc.result_json).map(([k, v]) => (
        <Text key={k}>{`${k}: ${String(v)}`}</Text>
      ))}

      <Text style={{ marginTop: 12, fontWeight: "bold" }}>Inputs</Text>
      {Object.entries(calc.input_json).map(([k, v]) => (
        <Text key={k}>{`${k}: ${String(v)}`}</Text>
      ))}

      {calc.goal && (
        <>
          <Text style={{ marginTop: 12, fontWeight: "bold" }}>Goal</Text>
          <Text>{calc.goal}</Text>
        </>
      )}

      <Button title="Close" onPress={() => router.back()} />
      <Button title="Delete" onPress={handleDelete} />
    </ScrollView>
  );
}
