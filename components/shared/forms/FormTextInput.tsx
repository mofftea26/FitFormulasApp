import { useField } from "formik";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import { Colors } from "@/theme/constants/Colors";
import { LucideIcon } from "lucide-react-native";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
  Icon?: LucideIcon;
  unit?: string;
};

export const FormTextInput: React.FC<Props> = ({
  name,
  label,
  placeholder,
  keyboardType = "default",
  Icon,
  unit,
}) => {
  const [field, meta, helpers] = useField<string>(name);
  const scheme = useColorScheme() ?? "light";
  const tint = Colors[scheme].tint;
  const text = Colors[scheme].text;
  const icon = Colors[scheme].icon;

  const showError = !!meta.touched && !!meta.error;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: icon }]}>{label}</Text>
      <View style={[styles.inputRow, { borderColor: showError ? tint : icon }]}>
        {Icon ? (
          <Icon size={18} color={icon} style={{ marginRight: 6 }} />
        ) : null}
        <TextInput
          style={[styles.input, { color: text }]}
          placeholder={placeholder}
          placeholderTextColor={icon}
          value={field.value?.toString() ?? ""}
          onChangeText={(v) => helpers.setValue(v)}
          onBlur={() => helpers.setTouched(true)}
          keyboardType={keyboardType}
          returnKeyType="done"
        />
        {unit ? (
          <Text style={[styles.unit, { color: icon }]}>{unit}</Text>
        ) : null}
      </View>
      {showError ? (
        <Text style={[styles.error, { color: tint }]}>{meta.error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  label: { fontSize: 12, marginBottom: 6 },
  inputRow: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 10 },
  unit: { marginLeft: 6, fontSize: 12 },
  error: { marginTop: 6, fontSize: 12 },
});
