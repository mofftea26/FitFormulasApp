import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { CalculationType, Calculation } from "@/types/calculationTypes";
import { useUserId } from "@/hooks/useUserId";
import { useCalculationsByType } from "@/features/calculations/hooks/useCalculationsByType";
import { useCalculationsByDate } from "@/features/calculations/hooks/useCalculationsByDate";
import { CalculationCard } from "@/features/calculations/components/CalculationCard";
import { DateFilterBar } from "@/features/calculations/components/DateFilterBar";
import { LoadingState } from "@/features/calculations/components/LoadingState";
import { ErrorState } from "@/features/calculations/components/ErrorState";
import { EmptyState } from "@/features/calculations/components/EmptyState";

export default function HistoryByType() {
  const { type } = useLocalSearchParams<{ type: CalculationType }>();
  const userId = useUserId();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [applied, setApplied] = useState<{ from: string; to: string } | null>(
    null
  );

  const byDate = useCalculationsByDate(
    userId,
    applied?.from ?? "",
    applied?.to ?? "",
    type
  );
  const byType = useCalculationsByType(userId, type as CalculationType);

  const usingDate = !!applied?.from && !!applied?.to;
  const data: Calculation[] = usingDate
    ? byDate.data ?? []
    : byType.data?.pages.flatMap((p) => p.data) ?? [];

  data.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const isLoading = usingDate ? byDate.isLoading : byType.isLoading;
  const error = usingDate ? byDate.error : byType.error;

  if (isLoading) return <LoadingState />;
  if (error)
    return <ErrorState error={error as Error} onRetry={usingDate ? byDate.refetch : byType.refetch} />;
  if (data.length === 0) return <EmptyState />;

  return (
    <View style={{ flex: 1 }}>
      <DateFilterBar
        from={from}
        to={to}
        setFrom={setFrom}
        setTo={setTo}
        onApply={() => setApplied(from && to ? { from, to } : null)}
        onClear={() => {
          setFrom("");
          setTo("");
          setApplied(null);
        }}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CalculationCard
            calculation={item}
            onPress={() =>
              router.push({
                pathname: "/(modals)/calc-details",
                params: { id: item.id, type: type as string },
              })
            }
          />
        )}
        onEndReached={() => {
          if (
            !usingDate &&
            byType.hasNextPage &&
            !byType.isFetchingNextPage
          ) {
            byType.fetchNextPage();
          }
        }}
      />
    </View>
  );
}
