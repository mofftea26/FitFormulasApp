import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/queries/useUserProfile";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: profile, isLoading, error } = useUserProfile(userId || "");

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading profile: {error.message}</Text>;
  if (!profile) return <Text>No profile found.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 Your Profile</Text>
      <Text>Username: {profile.username}</Text>
      <Text>Gender: {profile.gender || "N/A"}</Text>
      <Text>Date of Birth: {profile.dateOfBirth || "N/A"}</Text>
      <Text>Height: {profile.heightCm} cm</Text>
      <Text>Weight: {profile.weightKg} kg</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
