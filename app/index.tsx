import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { session, loading, signOut } = useAuth();
  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/(auth)/signin");
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

  if (!session) {
    return null;
  }

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText type="title">You are signed in</ThemedText>
      <TouchableOpacity onPress={signOut} style={{ marginTop: 20 }}>
        <ThemedText type="link">Sign Out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
