import { useQuery } from "@tanstack/react-query";
import { calcApi } from "@/api/calculationsApi";
import { qk } from "./queryKeys";
import { CalculationType } from "@/types/calculationTypes";

export function useCalculationsByDate(userId: string, from: string, to: string, type?: CalculationType) {
  return useQuery({
    queryKey: qk.byDate(userId, from, to, type),
    queryFn: () => calcApi.byDate({ userId, from, to, type }),
    enabled: !!from && !!to,
    staleTime: 60_000,
  });
}
