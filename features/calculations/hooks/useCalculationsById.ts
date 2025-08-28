import { useQuery } from "@tanstack/react-query";
import { calcApi } from "@/api/calculationsApi";
import { qk } from "./queryKeys";

export function useCalculationsById(userId: string, ids: string[]) {
  return useQuery({
    queryKey: qk.byId(userId, ids),
    queryFn: () => calcApi.byId({ userId, ids }),
    staleTime: 60_000,
    enabled: !!userId && ids.length > 0,
  });
}
