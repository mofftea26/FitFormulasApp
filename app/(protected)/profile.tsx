import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/queries/useUserProfile";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function ProfileScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: profile, isLoading, error } = useUserProfile(userId || "");
  const backgroundColor = useThemeColor({}, "background");

  if (isLoading) return <ActivityIndicator />;
  if (error)
    return <ThemedText>Error loading profile: {error.message}</ThemedText>;
  if (!profile) return <ThemedText>No profile found.</ThemedText>;
  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedText style={styles.header}>👤 Your Profile</ThemedText>
      <ThemedText>Username: {profile.username}</ThemedText>
      <ThemedText>Gender: {profile.gender || "N/A"}</ThemedText>
      <ThemedText>Date of Birth: {profile.dateOfBirth || "N/A"}</ThemedText>
      <ThemedText>Height: {profile.heightCm} cm</ThemedText>
      <ThemedText>Weight: {profile.weightKg} kg</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
