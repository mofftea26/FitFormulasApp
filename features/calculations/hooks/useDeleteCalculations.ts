import { useMutation, useQueryClient } from "@tanstack/react-query";
import { calcApi } from "@/api/calculationsApi";
import { qk } from "./queryKeys";

export function useDeleteCalculations(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => calcApi.delete({ userId, ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.root });
    },
  });
}
