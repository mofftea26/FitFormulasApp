import { FlatList } from "react-native";
import { Calculation } from "@/types/calculationTypes";
import { CalculationCard } from "./CalculationCard";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";

interface Props {
  data: Calculation[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onItemPress?: (calc: Calculation) => void;
  onDelete?: (id: string) => void;
  onRetry?: () => void;
}

export function CalculationList({
  data,
  isLoading,
  error,
  onItemPress,
  onDelete,
  onRetry,
}: Props) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!data || data.length === 0) return <EmptyState />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CalculationCard
          calculation={item}
          onClick={onItemPress ? () => onItemPress(item) : undefined}
          onDelete={onDelete ? () => onDelete(item.id) : undefined}
        />
      )}
    />
  );
}
