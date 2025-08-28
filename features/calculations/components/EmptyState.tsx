import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export function EmptyState({ message = "No data" }: { message?: string }) {
  return (
    <ThemedView style={{ padding: 16, alignItems: "center" }}>
      <ThemedText>{message}</ThemedText>
    </ThemedView>
  );
}
