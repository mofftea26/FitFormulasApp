import { View, TextInput, Button, StyleSheet } from "react-native";

interface Props {
  from: string;
  to: string;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function DateFilterBar({ from, to, setFrom, setTo, onApply, onClear }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="From"
        value={from}
        onChangeText={setFrom}
      />
      <TextInput
        style={styles.input}
        placeholder="To"
        value={to}
        onChangeText={setTo}
      />
      <Button title="Apply" onPress={onApply} />
      <Button title="Clear" onPress={onClear} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
  },
  input: {
    borderWidth: 1,
    padding: 4,
    flex: 1,
  },
});
