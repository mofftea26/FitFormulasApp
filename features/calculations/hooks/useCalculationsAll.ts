import { useQuery } from "@tanstack/react-query";
import { calcApi } from "@/api/calculationsApi";
import { qk } from "./queryKeys";

export function useCalculationsAll(userId: string) {
  return useQuery({
    queryKey: qk.all(userId),
    queryFn: () => calcApi.all({ userId }),
    staleTime: 60_000,
    enabled: !!userId,
  });
}
