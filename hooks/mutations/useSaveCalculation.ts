import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveCalculation } from "../../services/calculationService";

export function useSaveCalculation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      type: "BMR" | "TDEE" | "Macros";
      result: Record<string, any>;
      input?: Record<string, any>;
    }) => saveCalculation(userId, data.type, data.result, data.input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-calculations", userId],
      });
    },
  });
}
