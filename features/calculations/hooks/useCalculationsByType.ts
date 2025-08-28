import { useInfiniteQuery } from "@tanstack/react-query";
import { calcApi } from "@/api/calculationsApi";
import { qk } from "./queryKeys";
import { CalculationType } from "@/types/calculationTypes";

export function useCalculationsByType(userId: string, type: CalculationType, pageSize = 20) {
  return useInfiniteQuery({
    queryKey: qk.byType(userId, type, pageSize),
    queryFn: ({ pageParam = 0 }) =>
      calcApi.byType({ userId, type, limit: pageSize, offset: pageParam }),
    getNextPageParam: (last) => last.nextOffset ?? null,
    initialPageParam: 0,
    staleTime: 60_000,
  });
}
