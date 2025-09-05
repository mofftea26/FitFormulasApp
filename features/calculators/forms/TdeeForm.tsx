import { FormikProvider } from "formik";
import { Gauge } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { z } from "zod";

import { ActivityLevel } from "@/api/calculators/models";
import { useCalcTdee } from "@/api/calculators/queries";
import { EnumChips } from "@/components/shared/forms/EnumChips";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { ResultCard } from "@/components/shared/forms/ResultCard";
import { SubmitBar } from "@/components/shared/forms/SubmitBar";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useZodFormik } from "../hooks/uzeZodFormik";

const schema = z.object({
  bmr: z.coerce.number().positive("BMR must be > 0"),
  activityLevel: z.enum([
    "sedentary",
    "light",
    "moderate",
    "active",
    "very_active",
  ]),
});
type Values = z.infer<typeof schema>;

const levels: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "active", label: "Active" },
  { value: "very_active", label: "Very Active" },
];

const TdeeForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const { mutateAsync, isPending, data } = useCalcTdee();
  const [submitted, setSubmitted] = useState(false);
  const tintColor = useThemeColor({}, "tint");
  const bmrRef = useRef<TextInput>(null);
  const form = useZodFormik(schema, {
    initialValues: { bmr: "", activityLevel: "moderate" } as unknown as Values,
    onSubmit: async (v) => {
      await mutateAsync({
        userId: userId ?? "anonymous",
        bmr: Number(v.bmr),
        activityLevel: v.activityLevel,
      });
      setSubmitted(true);
    },
  });

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={24}
      keyboardOpeningTime={0}
      contentContainerStyle={{ flexGrow: 1, padding: 1.5 }}
    >
      <ThemedView style={{ gap: 12, flex: 1 }}>
        <ThemedText style={{ ...styles.title, color: tintColor }}>
          TDEE Calculator
        </ThemedText>

        <EnumChips
          value={form.values.activityLevel}
          onChange={(v) => form.setFieldValue("activityLevel", v)}
          options={levels}
        />

        <FormikProvider value={form}>
          <FormTextInput
            ref={bmrRef}
            name="bmr"
            label="BMR (kcal/day)"
            placeholder="e.g., 1850"
            keyboardType="numeric"
            Icon={Gauge}
            returnKeyType="done"
            onSubmitEditing={form.handleSubmit as any}
          />

          {!submitted && (
            <Pressable onPress={form.handleSubmit as any}>
              <SubmitBar loading={isPending} label="Calculate TDEE" />
            </Pressable>
          )}

          {submitted && data && (
            <View style={{ gap: 8 }}>
              <ResultCard
                title="TDEE Result"
                rows={[
                  { label: "TDEE", value: `${Math.round(data.tdee)} kcal/day` },
                ]}
              />
              <Pressable onPress={onDone} style={styles.closeBtn}>
                <ThemedText style={{ color: "#fff", fontWeight: "700" }}>
                  Close
                </ThemedText>
              </Pressable>
            </View>
          )}
        </FormikProvider>
      </ThemedView>
    </KeyboardAwareScrollView>
  );
};

export default TdeeForm;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 18,
  },
  closeBtn: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
});
