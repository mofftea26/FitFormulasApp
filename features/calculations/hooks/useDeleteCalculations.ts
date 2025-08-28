import { useMutation, useQueryClient } from "@tanstack/react-query";
import { calcApi } from "@/api/calculationsApi";
import { qk } from "./queryKeys";

export function useDeleteCalculations(userId: string, type?: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => calcApi.delete({ userId, ids }),
    onSuccess: (_, ids) => {
      qc.invalidateQueries({ queryKey: qk.latest(userId) });
      qc.invalidateQueries({ queryKey: qk.all(userId) });
      if (type) qc.invalidateQueries({ predicate: (q) => (q.queryKey as any[]).includes("byType") });
      qc.invalidateQueries({ predicate: (q) => (q.queryKey as any[]).includes("byId") });
    },
  });
}
