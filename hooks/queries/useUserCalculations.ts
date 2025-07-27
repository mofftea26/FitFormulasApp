import { useQuery } from "@tanstack/react-query";
import { getUserCalculations } from "../../services/calculationService";

export function useUserCalculations(userId: string) {
  return useQuery({
    queryKey: ["user-calculations", userId],
    queryFn: () => getUserCalculations(userId),
    enabled: !!userId,
  });
}
