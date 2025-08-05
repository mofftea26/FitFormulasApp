import { router } from "expo-router";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";

// const fetchData = async () => {
//   const { data, error } = await supabase.from("users").select("*");
//   console.log("data", data);
// };

// const calculateData = async (user_id: string) => {
//   const { data, error } = await supabase.from("calculations").insert([
//     {
//       user_id: user_id,
//       type: "BMR",
//       result_json: { bmr: 2000 },
//     },
//   ]);
//   console.log("data", data);
// };

export default function HomeScreen() {
  const { session, signOut } = useAuth();
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

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
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  // useEffect(() => {
  //   fetchData();
  //   calculateData(session?.user?.id || "");
  //   fetchData();
  // }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Welcome!</ThemedText>
        <ThemedText style={styles.subtitle}>
          You&apos;re successfully signed in to your fitness app
        </ThemedText>
      </ThemedView>

      <ThemedView style={[styles.userInfo, { borderColor: textColor + "20" }]}>
        <ThemedText type="subtitle">User Information</ThemedText>
        <ThemedText>Email: {session?.user?.email}</ThemedText>
        <ThemedText>User ID: {session?.user?.id}</ThemedText>
        <ThemedText>
          Email Verified: {session?.user?.email_confirmed_at ? "Yes" : "No"}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedText type="subtitle">Your Fitness Dashboard</ThemedText>
        <ThemedText style={styles.description}>
          This is your protected home page. Here you can add your fitness
          tracking features, workout plans, progress monitoring, and more.
        </ThemedText>

        <ThemedView style={styles.featureList}>
          <ThemedText>• Track your workouts</ThemedText>
          <ThemedText>• Monitor your progress</ThemedText>
          <ThemedText>• Set fitness goals</ThemedText>
          <ThemedText>• View your statistics</ThemedText>
        </ThemedView>
      </ThemedView>

      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: tintColor }]}
        onPress={handleSignOut}
        activeOpacity={0.8}
      >
        <ThemedText
          style={[styles.signOutButtonText, { color: backgroundColor }]}
        >
          Sign Out
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    opacity: 0.7,
  },
  userInfo: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    gap: 8,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    gap: 16,
  },
  description: {
    lineHeight: 24,
    opacity: 0.8,
  },
  featureList: {
    marginTop: 16,
    gap: 8,
  },
  signOutButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signOutButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
