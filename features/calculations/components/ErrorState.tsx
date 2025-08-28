import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "react-native";

interface Props {
  error: Error | null;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: Props) {
  return (
    <ThemedView style={{ padding: 16, alignItems: "center" }}>
      <ThemedText>{error?.message || "Something went wrong"}</ThemedText>
      {onRetry && <Button title="Retry" onPress={onRetry} />}
    </ThemedView>
  );
}
