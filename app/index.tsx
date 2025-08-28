import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { session, loading } = useAuth();
  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.push("/(tabs)");
      } else {
        router.push("/(auth)/signin");
      }
    }
  }, [session, loading]);

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

  return null;
}
