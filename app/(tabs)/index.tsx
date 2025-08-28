import { ScrollView } from "react-native";
import { router } from "expo-router";
import { useUserId } from "@/hooks/useUserId";
import { useCalculationsAll } from "@/features/calculations/hooks/useCalculationsAll";
import { CalculationCard } from "@/features/calculations/components/CalculationCard";
import { LoadingState } from "@/features/calculations/components/LoadingState";
import { ErrorState } from "@/features/calculations/components/ErrorState";
import { EmptyState } from "@/features/calculations/components/EmptyState";

export default function HomeScreen() {
  const userId = useUserId();
  const { data, isLoading, error, refetch } = useCalculationsAll(userId);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} onRetry={refetch} />;

  const recent = (data ?? []).slice(0, 5);
  if (recent.length === 0) return <EmptyState />;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {recent.map((c) => (
        <CalculationCard
          key={c.id}
          calculation={c}
          onPress={() =>
            router.push({
              pathname: "/(modals)/calc-details",
              params: { id: c.id, type: c.type },
            })
          }
        />
      ))}
    </ScrollView>
  );
}
