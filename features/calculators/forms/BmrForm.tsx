// BmrForm.tsx
import { FormikProvider } from "formik";
import { Calendar, Percent, Ruler, Scale, User2 } from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { z } from "zod";

import { BmrEquation, Gender } from "@/api/calculators/models";
import { useCalcBmr } from "@/api/calculators/queries";
import { EnumChips } from "@/components/shared/forms/EnumChips";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { ResultCard } from "@/components/shared/forms/ResultCard";
import { SubmitBar } from "@/components/shared/forms/SubmitBar";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { CARD_COLORS } from "@/constants/calculators/cardColors";
import { useAuth } from "@/contexts/AuthContext";
import { Colors } from "@/theme/constants/Colors";
import { useZodFormik } from "../hooks/uzeZodFormik";

const mifflinSchema = z.object({
  equation: z.literal("mifflin"),
  weightKg: z.coerce.number().positive("Weight must be > 0"),
  heightCm: z.coerce.number().positive("Height must be > 0"),
  age: z.coerce.number().int().min(10).max(100),
  gender: z.enum(["male", "female"]),
  bodyFatPercent: z.any().optional(),
});

const harrisSchema = z.object({
  equation: z.literal("harris"),
  weightKg: z.coerce.number().positive("Weight must be > 0"),
  heightCm: z.coerce.number().positive("Height must be > 0"),
  age: z.coerce.number().int().min(10).max(100),
  gender: z.enum(["male", "female"]),
  bodyFatPercent: z.any().optional(),
});

const katchSchema = z.object({
  equation: z.literal("katch"),
  weightKg: z.coerce.number().positive("Weight must be > 0"),
  bodyFatPercent: z.coerce.number().min(3).max(70, "Unrealistic BF%"),
  heightCm: z.any().optional(),
  age: z.any().optional(),
  gender: z.any().optional(),
});

const schema = z.discriminatedUnion("equation", [
  mifflinSchema,
  harrisSchema,
  katchSchema,
]);
type Values = z.infer<typeof schema>;

const genderOptions = [
  { value: "male" as Gender, label: "Male", Icon: User2 },
  { value: "female" as Gender, label: "Female", Icon: User2 },
];
const eqOptions = [
  { value: "mifflin" as BmrEquation, label: "Mifflin" },
  { value: "harris" as BmrEquation, label: "Harris" },
  { value: "katch" as BmrEquation, label: "Katch" },
];

const BmrForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const scheme = useColorScheme() ?? "light";
  const { mutateAsync, isPending, data } = useCalcBmr();
  const [submitted, setSubmitted] = useState(false);

  const weightRef = useRef<TextInput>(null);
  const heightRef = useRef<TextInput>(null);
  const ageRef = useRef<TextInput>(null);
  const bfRef = useRef<TextInput>(null);

  const form = useZodFormik(schema, {
    initialValues: {
      weightKg: "",
      heightCm: "",
      age: "",
      gender: "male",
      bodyFatPercent: "",
      equation: "mifflin",
    } as unknown as Values,
    onSubmit: async (vals) => {
      try {
        if (vals.equation === "katch") {
          await mutateAsync({
            userId: userId ?? "anonymous",
            weightKg: Number(vals.weightKg),
            bodyFatPercent: Number((vals as any).bodyFatPercent),
            equation: "katch",
            age: 0,
            gender: "male",
          });
        } else {
          await mutateAsync({
            userId: userId ?? "anonymous",
            weightKg: Number(vals.weightKg),
            heightCm: Number((vals as any).heightCm),
            age: Number((vals as any).age),
            gender: (vals as any).gender,
            equation: vals.equation,
          });
        }
        setSubmitted(true);
      } catch (e) {
        console.error(e);
      }
    },
  });

  const needsHeight = useMemo(
    () =>
      form.values.equation === "mifflin" || form.values.equation === "harris",
    [form.values.equation]
  );
  const needsBF = form.values.equation === "katch";

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardShouldPersistTaps="always"
      extraScrollHeight={24}
      keyboardOpeningTime={0}
      contentContainerStyle={{ flexGrow: 1, padding: 1 }}
    >
      <ThemedView style={{ gap: 12, flex: 1 }}>
        <ThemedText style={{ ...styles.title, color: CARD_COLORS.BMR }}>
          BMR Calculator
        </ThemedText>

        {!needsBF && (
          <EnumChips
            value={form.values.gender}
            onChange={(v) => form.setFieldValue("gender", v)}
            options={genderOptions}
            color={CARD_COLORS.BMR}
          />
        )}

        <EnumChips
          value={form.values.equation}
          onChange={(v) => {
            form.setFieldValue("equation", v);
            form.setErrors({});
          }}
          options={eqOptions}
        />

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
            onSubmitEditing={() => {
              if (needsHeight) {
                heightRef.current?.focus();
              } else if (!needsBF) {
                ageRef.current?.focus();
              } else {
                bfRef.current?.focus();
              }
            }}
          />

          {needsHeight && (
            <FormTextInput
              ref={heightRef}
              name="heightCm"
              label="Height"
              placeholder="e.g., 175"
              keyboardType="numeric"
              Icon={Ruler}
              unit="cm"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                ageRef.current?.focus();
              }}
            />
          )}

          {!needsBF && (
            <FormTextInput
              ref={ageRef}
              name="age"
              label="Age"
              placeholder="e.g., 30"
              keyboardType="numeric"
              Icon={Calendar}
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={() => form.submitForm()}
            />
          )}

          {needsBF && (
            <FormTextInput
              ref={bfRef}
              name="bodyFatPercent"
              label="Body Fat %"
              placeholder="e.g., 15"
              keyboardType="numeric"
              Icon={Percent}
              unit="%"
              returnKeyType="done"
              onSubmitEditing={() => form.submitForm()}
            />
          )}

          {!submitted && (
            <SubmitBar
              loading={isPending}
              label="Calculate BMR"
              disabled={isPending}
              onPress={() => {
                Keyboard.dismiss();
                form.submitForm();
              }}
              bgColor={CARD_COLORS.BMR}
            />
          )}

          {submitted && data && (
            <>
              <SubmitBar
                loading={isPending}
                label="Recalculate"
                disabled={isPending}
                onPress={() => {
                  Keyboard.dismiss();
                  form.submitForm();
                }}
                bgColor={CARD_COLORS.BMR}
              />

              <View style={{ gap: 8 }}>
                <ResultCard
                  color={CARD_COLORS.BMR}
                  title="BMR Result"
                  rows={[
                    { label: "BMR", value: `${Math.round(data.bmr)} kcal/day` },
                    { label: "Equation", value: data.equation.toUpperCase() },
                  ]}
                />
                <Pressable onPress={onDone} style={styles.closeBtn}>
                  <ThemedText style={{ color: "#fff", fontWeight: "700" }}>
                    Close
                  </ThemedText>
                </Pressable>
              </View>
            </>
          )}
        </FormikProvider>

        <Text style={{ fontSize: 12, color: Colors[scheme].icon }}>
          Tip: Use Katch if you know body fat %; otherwise Mifflin is a solid
          default.
        </Text>
      </ThemedView>
    </KeyboardAwareScrollView>
  );
};

export default BmrForm;

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
