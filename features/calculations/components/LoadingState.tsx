import { ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/ThemedView";

export function LoadingState() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
    </ThemedView>
  );
}
