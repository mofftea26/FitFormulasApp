import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../services/userService";

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId, // don’t run if userId is null
  });
}
