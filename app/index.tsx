import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { session, loading } = useAuth();
  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    console.log("Index useEffect - loading:", loading, "session:", !!session);

    if (!loading) {
      if (session) {
        // User is authenticated, redirect to protected home
        router.push("/(protected)/home");
      } else {
        // User is not authenticated, redirect to signin
        router.push("/(auth)/signin");
      }
    }
  }, [session, loading]);

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // This component doesn't render anything visible after navigation
  return null;
}
