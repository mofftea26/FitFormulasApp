import { useAuth } from "@/contexts/AuthContext";

export function useUserId() {
  const { session } = useAuth();
  return session?.user.id ?? "";
}
