import { FormikProvider } from "formik";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { z } from "zod";

import { ActivityLevel, Goal } from "@/api/calculators/models";
import { useCalcMacros } from "@/api/calculators/queries";
import { EnumChips } from "@/components/shared/forms/EnumChips";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { ResultCard } from "@/components/shared/forms/ResultCard";
import { SubmitBar } from "@/components/shared/forms/SubmitBar";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useZodFormik } from "../hooks/uzeZodFormik";

const schema = z
  .object({
    weightKg: z.coerce.number().positive(),
    goal: z.enum(["fatLoss", "maintenance", "muscleGain"]),
    method: z.enum(["tdee", "bmr+activity"]), // UI-only
    tdee: z.coerce.number().positive().optional(),
    bmr: z.coerce.number().positive().optional(),
    activityLevel: z
      .enum(["sedentary", "light", "moderate", "active", "very_active"])
      .optional(),
  })
  .refine(
    (v) =>
      (v.method === "tdee" && v.tdee) ||
      (v.method === "bmr+activity" && v.bmr && v.activityLevel),
    { message: "Provide TDEE, or BMR + Activity Level" }
  );

type Values = z.infer<typeof schema>;

const goalOptions: { value: Goal; label: string }[] = [
  { value: "fatLoss", label: "Fat Loss" },
  { value: "maintenance", label: "Maintain" },
  { value: "muscleGain", label: "Muscle Gain" },
];
const levels: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "active", label: "Active" },
  { value: "very_active", label: "Very Active" },
];

const MacrosForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const { mutateAsync, isPending, data } = useCalcMacros();
  const [submitted, setSubmitted] = useState(false);
  const tintColor = useThemeColor({}, "tint");
  const weightRef = useRef<TextInput>(null);
  const tdeeRef = useRef<TextInput>(null);
  const bmrRef = useRef<TextInput>(null);
  const form = useZodFormik(schema, {
    initialValues: {
      weightKg: "",
      goal: "maintenance",
      method: "tdee",
      tdee: "",
      bmr: "",
      activityLevel: "moderate",
    } as unknown as Values,
    onSubmit: async (v) => {
      await mutateAsync({
        userId: userId ?? "anonymous",
        weightKg: Number(v.weightKg),
        goal: v.goal,
        tdee: v.method === "tdee" ? Number(v.tdee) : undefined,
        bmr: v.method === "bmr+activity" ? Number(v.bmr) : undefined,
        activityLevel:
          v.method === "bmr+activity" ? v.activityLevel : undefined,
      });
      setSubmitted(true);
    },
  });

  const method = form.values.method;

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
          Macros Calculator
        </ThemedText>

        <EnumChips
          value={form.values.goal}
          onChange={(v) => form.setFieldValue("goal", v)}
          options={goalOptions}
        />
        <EnumChips
          value={method}
          onChange={(v) => form.setFieldValue("method", v)}
          options={[
            { value: "tdee", label: "Use TDEE" },
            { value: "bmr+activity", label: "BMR + Activity" },
          ]}
        />

        <FormikProvider value={form}>
          <FormTextInput
            ref={weightRef}
            name="weightKg"
            label="Weight"
            placeholder="e.g., 88"
            keyboardType="numeric"
            unit="kg"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => tdeeRef.current?.focus()}
          />

          {method === "tdee" ? (
            <FormTextInput
              ref={tdeeRef}
              name="tdee"
              label="TDEE"
              placeholder="e.g., 2600"
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={form.handleSubmit as any}
            />
          ) : (
            <>
              <FormTextInput
                ref={bmrRef}
                name="bmr"
                label="BMR"
                placeholder="e.g., 1850"
                keyboardType="numeric"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={form.handleSubmit as any}
              />
              <EnumChips
                value={form.values.activityLevel!}
                onChange={(v) => form.setFieldValue("activityLevel", v)}
                options={levels}
              />
            </>
          )}

          {!submitted && (
            <Pressable onPress={form.handleSubmit as any}>
              <SubmitBar loading={isPending} label="Calculate Macros" />
            </Pressable>
          )}

          {submitted && data && (
            <View style={{ gap: 8 }}>
              <ResultCard
                title="Macros Result"
                rows={[
                  {
                    label: "Calories",
                    value: `${Math.round(data.calories)} kcal`,
                  },
                  { label: "Protein", value: `${Math.round(data.protein)} g` },
                  { label: "Carbs", value: `${Math.round(data.carbs)} g` },
                  { label: "Fat", value: `${Math.round(data.fat)} g` },
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

export default MacrosForm;

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
