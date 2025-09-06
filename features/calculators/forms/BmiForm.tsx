import { FormikProvider } from "formik";
import { Ruler, Scale } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { z } from "zod";

import { useCalcBmi } from "@/api/calculators/queries";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { ResultCard } from "@/components/shared/forms/ResultCard";
import { SubmitBar } from "@/components/shared/forms/SubmitBar";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { CARD_COLORS } from "@/constants/calculators/cardColors";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useZodFormik } from "../hooks/uzeZodFormik";

const schema = z.object({
  weightKg: z.coerce.number().positive(),
  heightCm: z.coerce.number().positive(),
});
type Values = z.infer<typeof schema>;

const BmiForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const { mutateAsync, isPending, data } = useCalcBmi();
  const [submitted, setSubmitted] = useState(false);
  const tintColor = useThemeColor({}, "tint");
  const weightRef = useRef<TextInput>(null);
  const heightRef = useRef<TextInput>(null);
  const form = useZodFormik(schema, {
    initialValues: { weightKg: "", heightCm: "" } as unknown as Values,
    onSubmit: async (v) => {
      try {
        await mutateAsync({
          userId: userId ?? "anonymous",
          weightKg: Number(v.weightKg),
          heightCm: Number(v.heightCm),
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
      extraScrollHeight={20} // nudge focused input above keyboard
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <ThemedView style={{ gap: 12, flex: 1 }}>
        <ThemedText style={{ ...styles.title, color: tintColor }}>
          BMI Calculator
        </ThemedText>

        <FormikProvider value={form}>
          <FormTextInput
            ref={weightRef}
            name="weightKg"
            label="Weight"
            placeholder="e.g., 88"
            keyboardType="numeric"
            Icon={Scale}
            unit="kg"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => heightRef.current?.focus()}
          />
          <FormTextInput
            ref={heightRef}
            name="heightCm"
            label="Height"
            placeholder="e.g., 175"
            keyboardType="numeric"
            Icon={Ruler}
            unit="cm"
            returnKeyType={submitted ? "done" : "go"}
            onSubmitEditing={() => form.submitForm()}
          />
          {!submitted && (
            <SubmitBar
              loading={isPending}
              label="Calculate BMI"
              onPress={() => {
                Keyboard.dismiss();
                form.submitForm();
              }}
              disabled={isPending}
            />
          )}

          {submitted && data && (
            <ThemedView style={{ gap: 8 }}>
              <ResultCard
                color={CARD_COLORS.BMI}
                title="BMI Result"
                rows={[
                  { label: "BMI", value: data.bmi.toFixed(1) },
                  { label: "Category", value: data.category },
                ]}
              />
              <Pressable onPress={onDone} style={styles.closeBtn}>
                <ThemedText style={{ color: "#fff", fontWeight: "700" }}>
                  Close
                </ThemedText>
              </Pressable>
            </ThemedView>
          )}
        </FormikProvider>
      </ThemedView>
    </KeyboardAwareScrollView>
  );
};

export default BmiForm;

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
