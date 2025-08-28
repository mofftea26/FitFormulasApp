import { ScrollView } from "react-native";
import { router } from "expo-router";
import { useUserId } from "@/hooks/useUserId";
import { useCalculationsLatest } from "@/features/calculations/hooks/useCalculationsLatest";
import { CalculationType, Calculation } from "@/types/calculationTypes";
import { CalculationTypeCard } from "@/features/calculations/components/CalculationTypeCard";
import { LoadingState } from "@/features/calculations/components/LoadingState";
import { ErrorState } from "@/features/calculations/components/ErrorState";

const TYPES: CalculationType[] = [
  "BMR",
  "BMI",
  "BodyComposition",
  "TDEE",
  "MACROS",
  "OTHER",
];

export default function ProgressOverview() {
  const userId = useUserId();
  const { data, isLoading, error, refetch } = useCalculationsLatest(userId);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} onRetry={refetch} />;

  const latest = (data && ("data" in data ? data.data : data)) as Record<
    CalculationType,
    Calculation | null
  >;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {TYPES.map((t) => (
        <CalculationTypeCard
          key={t}
          type={t}
          latest={latest?.[t] ?? null}
          onPress={() =>
            router.push({
              pathname: "/(progress-stack)/[type]",
              params: { type: t },
            })
          }
        />
      ))}
    </ScrollView>
  );
}
