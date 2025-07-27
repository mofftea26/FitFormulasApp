import { router } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function HomeScreen() {
  const { session, signOut } = useAuth();
  const tintColor = useThemeColor({}, "tint");

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/signin");
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <ThemedView className="flex-1 p-5">
      <ThemedView className="items-center mt-15 mb-10">
        <ThemedText type="title">Welcome!</ThemedText>
        <ThemedText className="text-center mt-2 opacity-70">
          You&apos;re successfully signed in to your fitness app
        </ThemedText>
      </ThemedView>

      <ThemedView className="p-5 rounded-xl mb-8 gap-2 border" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
        <ThemedText type="subtitle">User Information</ThemedText>
        <ThemedText>Email: {session?.user?.email}</ThemedText>
        <ThemedText>User ID: {session?.user?.id}</ThemedText>
        <ThemedText>
          Email Verified: {session?.user?.email_confirmed_at ? "Yes" : "No"}
        </ThemedText>
      </ThemedView>

      <ThemedView className="flex-1 gap-4">
        <ThemedText type="subtitle">Your Fitness Dashboard</ThemedText>
        <ThemedText className="leading-6 opacity-80">
          This is your protected home page. Here you can add your fitness
          tracking features, workout plans, progress monitoring, and more.
        </ThemedText>

        <ThemedView className="mt-4 gap-2">
          <ThemedText>• Track your workouts</ThemedText>
          <ThemedText>• Monitor your progress</ThemedText>
          <ThemedText>• Set fitness goals</ThemedText>
          <ThemedText>• View your statistics</ThemedText>
        </ThemedView>
      </ThemedView>

      <TouchableOpacity
        className="h-12 rounded-lg justify-center items-center mt-5"
        style={{ backgroundColor: tintColor }}
        onPress={handleSignOut}
        activeOpacity={0.8}
      >
        <ThemedText className="text-white text-lg font-semibold">Sign Out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

