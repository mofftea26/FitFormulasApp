import { Stack, router } from "expo-router";
import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedLayout() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      // Redirect to signin if not authenticated
      router.replace("/(auth)/signin");
    }
  }, [session, loading]);

  // Don't render anything while checking authentication
  if (loading || !session) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
