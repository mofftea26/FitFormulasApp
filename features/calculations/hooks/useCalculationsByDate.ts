import { useQuery } from "@tanstack/react-query";
import { calcApi } from "@/api/calculationsApi";
import { qk } from "./queryKeys";

export function useCalculationsByDate(userId: string, from: string, to: string) {
  return useQuery({
    queryKey: qk.byDate(userId, from, to),
    queryFn: () => calcApi.byDate({ userId, from, to }),
    staleTime: 60_000,
    enabled: !!userId && !!from && !!to,
  });
}
