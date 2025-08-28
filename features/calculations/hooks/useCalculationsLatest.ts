import { useQuery } from "@tanstack/react-query";
import { calcApi } from "@/api/calculationsApi";
import { qk } from "./queryKeys";

export function useCalculationsLatest(userId: string) {
  return useQuery({
    queryKey: qk.latest(userId),
    queryFn: () => calcApi.latest({ userId }),
    staleTime: 60_000,
    enabled: !!userId,
  });
}
