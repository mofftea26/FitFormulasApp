import { Colors } from "@/theme/constants/Colors";
import { useField } from "formik";
import { LucideIcon } from "lucide-react-native";
import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
  Icon?: LucideIcon;
  unit?: string;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  blurOnSubmit?: boolean;
  /** Called when the user presses the keyboard action (Next/Done) */
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
};

export const FormTextInput = forwardRef<TextInput, Props>(
  function FormTextInput(
    {
      name,
      label,
      placeholder,
      keyboardType = "default",
      Icon,
      unit,
      returnKeyType = "done",
      blurOnSubmit = true,
      onSubmitEditing,
    },
    ref
  ) {
    const [field, meta, helpers] = useField<string>(name);
    const scheme = useColorScheme() ?? "light";
    const tint = Colors[scheme].tint;
    const text = Colors[scheme].text;
    const icon = Colors[scheme].icon;

    const showError = !!meta.touched && !!meta.error;

    return (
      <View style={styles.wrap}>
        <Text style={[styles.label, { color: icon }]}>{label}</Text>
        <View
          style={[styles.inputRow, { borderColor: showError ? tint : icon }]}
        >
          {Icon ? (
            <Icon size={18} color={icon} style={{ marginRight: 6 }} />
          ) : null}
          <TextInput
            ref={ref}
            style={[styles.input, { color: text }]}
            placeholder={placeholder}
            placeholderTextColor={icon}
            value={field.value?.toString() ?? ""}
            onChangeText={(v) => helpers.setValue(v)}
            onBlur={() => helpers.setTouched(true)}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            blurOnSubmit={blurOnSubmit}
            onSubmitEditing={onSubmitEditing}
            // Optional: enables “Next” only when there’s text
            // enablesReturnKeyAutomatically
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
  }
);

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
