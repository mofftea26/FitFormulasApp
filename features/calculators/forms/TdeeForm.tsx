import { FormikProvider } from "formik";
import { Gauge } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";
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
import { CARD_COLORS } from "@/constants/calculators/cardColors";
import { useAuth } from "@/contexts/AuthContext";
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
  const bmrRef = useRef<TextInput>(null);
  const form = useZodFormik(schema, {
    initialValues: { bmr: "", activityLevel: "moderate" } as unknown as Values,
    onSubmit: async (v) => {
      try {
        await mutateAsync({
          userId: userId ?? "anonymous",
          bmr: Number(v.bmr),
          activityLevel: v.activityLevel,
        });
        setSubmitted(true);
      } catch (e) {
        console.error(e);
      }
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
        <ThemedText style={{ ...styles.title, color: CARD_COLORS.TDEE }}>
          TDEE Calculator
        </ThemedText>

        <EnumChips
          value={form.values.activityLevel}
          onChange={(v) => form.setFieldValue("activityLevel", v)}
          options={levels}
          color={CARD_COLORS.TDEE}
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
            onSubmitEditing={() => form.submitForm()}
          />

          {!submitted && (
            <SubmitBar
              loading={isPending}
              label="Calculate TDEE"
              onPress={() => {
                Keyboard.dismiss();
                form.submitForm();
              }}
              disabled={isPending}
              bgColor={CARD_COLORS.TDEE}
            />
          )}

          {submitted && data && (
            <SubmitBar
              loading={isPending}
              label="Recalculate"
              onPress={() => {
                Keyboard.dismiss();
                form.submitForm();
              }}
              disabled={isPending}
              bgColor={CARD_COLORS.TDEE}
            />
          )}

          {submitted && data && (
            <View style={{ gap: 8 }}>
              <ResultCard
                color={CARD_COLORS.TDEE}
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
