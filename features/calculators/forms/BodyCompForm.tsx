// BodyCompForm.tsx
import { FormikProvider } from "formik";
import { Ruler, Scale, User2, UserSquare } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { z } from "zod";

import { Gender } from "@/api/calculators/models";
import { useCalcBodyComp } from "@/api/calculators/queries";
import { EnumChips } from "@/components/shared/forms/EnumChips";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { ResultCard } from "@/components/shared/forms/ResultCard";
import { SubmitBar } from "@/components/shared/forms/SubmitBar";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { CARD_COLORS } from "@/constants/calculators/cardColors";
import { useAuth } from "@/contexts/AuthContext";
import { useZodFormik } from "../hooks/uzeZodFormik";

const isNum = (s: string) => /^(\d+([.,]\d+)?)$/.test(s.trim());
const toNum = (s?: string) =>
  s && s.trim() !== "" ? Number(s.replace(",", ".")) : undefined;

const schema = z
  .object({
    weightKg: z
      .string()
      .min(1, "Required")
      .refine(isNum, "Enter a valid number > 0")
      .refine((s) => Number(s.replace(",", ".")) > 0, "Must be > 0"),

    mode: z.enum(["bfInput", "usNavy"]),

    bodyFatPercent: z
      .string()
      .optional()
      .transform((v) => v ?? ""),

    gender: z.enum(["male", "female"]).optional(),
    heightCm: z
      .string()
      .optional()
      .transform((v) => v ?? ""),
    neckCm: z
      .string()
      .optional()
      .transform((v) => v ?? ""),
    waistCm: z
      .string()
      .optional()
      .transform((v) => v ?? ""),
    hipCm: z
      .string()
      .optional()
      .transform((v) => v ?? ""),
  })
  .superRefine((v, ctx) => {
    if (v.mode === "bfInput") {
      if (!v.bodyFatPercent || !isNum(v.bodyFatPercent)) {
        ctx.addIssue({
          code: "custom",
          path: ["bodyFatPercent"],
          message: "Enter your Body Fat %",
        });
      } else {
        const bf = toNum(v.bodyFatPercent)!;
        if (bf < 3 || bf > 70) {
          ctx.addIssue({
            code: "custom",
            path: ["bodyFatPercent"],
            message: "BF% must be between 3 and 70",
          });
        }
      }
      return;
    }

    if (!v.gender) {
      ctx.addIssue({
        code: "custom",
        path: ["gender"],
        message: "Required",
      });
    }

    const checks: { key: keyof typeof v; label: string }[] = [
      { key: "heightCm", label: "height" },
      { key: "neckCm", label: "neck" },
      { key: "waistCm", label: "waist" },
    ];

    for (const { key } of checks) {
      const val = (v[key] as string) ?? "";
      if (!isNum(val) || Number(val.replace(",", ".")) <= 0) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "Required",
        });
      }
    }

    if (v.gender === "female") {
      const hp = v.hipCm ?? "";
      if (!isNum(hp) || Number(hp.replace(",", ".")) <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["hipCm"],
          message: "Required",
        });
      }
    }
  });

const genders = [
  { value: "male" as Gender, label: "Male", Icon: User2 },
  { value: "female" as Gender, label: "Female", Icon: User2 },
];

const BodyCompForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const { mutateAsync, isPending, data } = useCalcBodyComp();
  const [submitted, setSubmitted] = useState(false);

  const weightRef = useRef<TextInput>(null);
  const bodyFatPercentRef = useRef<TextInput>(null);
  const heightRef = useRef<TextInput>(null);
  const neckRef = useRef<TextInput>(null);
  const waistRef = useRef<TextInput>(null);
  const hipRef = useRef<TextInput>(null);

  const form = useZodFormik(schema, {
    initialValues: {
      weightKg: "",
      mode: "bfInput",
      bodyFatPercent: "",
      gender: "male",
      heightCm: "",
      neckCm: "",
      waistCm: "",
      hipCm: "",
    },
    onSubmit: async (v) => {
      try {
        await mutateAsync({
          userId: userId ?? "anonymous",
          weightKg: toNum(v.weightKg)!,
          bodyFatPercent:
            v.mode === "bfInput" ? toNum(v.bodyFatPercent) : undefined,
          gender: v.mode === "usNavy" ? (v.gender as Gender) : undefined,
          heightCm: v.mode === "usNavy" ? toNum(v.heightCm) : undefined,
          neckCm: v.mode === "usNavy" ? toNum(v.neckCm) : undefined,
          waistCm: v.mode === "usNavy" ? toNum(v.waistCm) : undefined,
          hipCm:
            v.mode === "usNavy" && v.gender === "female"
              ? toNum(v.hipCm)
              : undefined,
        });
        setSubmitted(true);
      } catch (e) {
        console.error(e);
      }
    },
  });

  const mode = form.values.mode;
  const isUSNavy = mode === "usNavy";
  const isFemale = form.values.gender === "female";

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardShouldPersistTaps="always"
      extraScrollHeight={24}
      keyboardOpeningTime={0}
      contentContainerStyle={{ flexGrow: 1, padding: 1.5 }}
    >
      <ThemedView style={{ gap: 12, flex: 1 }}>
        <ThemedText
          style={{ ...styles.title, color: CARD_COLORS.BodyComposition }}
        >
          Body Composition
        </ThemedText>

        <EnumChips
          value={mode}
          onChange={(v) => {
            form.setFieldValue("mode", v);
            form.setErrors({});
          }}
          options={[
            { value: "bfInput", label: "I know my BF%" },
            { value: "usNavy", label: "Estimate (US Navy)" },
          ]}
          color={CARD_COLORS.BodyComposition}
        />

        {isUSNavy && (
          <EnumChips
            value={form.values.gender!}
            onChange={(v) => {
              form.setFieldValue("gender", v);
              form.setErrors({});
            }}
            options={genders}
            color={CARD_COLORS.BodyComposition}
          />
        )}

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
              if (!isUSNavy) bodyFatPercentRef.current?.focus();
              else heightRef.current?.focus();
            }}
          />

          {!isUSNavy && (
            <FormTextInput
              ref={bodyFatPercentRef}
              name="bodyFatPercent"
              label="Body Fat %"
              placeholder="e.g., 15"
              keyboardType="numeric"
              unit="%"
              returnKeyType="done"
              onSubmitEditing={() => form.submitForm()}
            />
          )}

          {isUSNavy && (
            <>
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
                onSubmitEditing={() => neckRef.current?.focus()}
              />
              <FormTextInput
                ref={neckRef}
                name="neckCm"
                label="Neck"
                placeholder="e.g., 40"
                keyboardType="numeric"
                Icon={UserSquare}
                unit="cm"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => waistRef.current?.focus()}
              />
              <FormTextInput
                ref={waistRef}
                name="waistCm"
                label="Waist"
                placeholder="e.g., 82"
                keyboardType="numeric"
                Icon={UserSquare}
                unit="cm"
                returnKeyType={isFemale ? "next" : "done"}
                blurOnSubmit={!isFemale}
                onSubmitEditing={() =>
                  isFemale ? hipRef.current?.focus() : form.submitForm()
                }
              />
              {isFemale && (
                <FormTextInput
                  ref={hipRef}
                  name="hipCm"
                  label="Hip"
                  placeholder="e.g., 95"
                  keyboardType="numeric"
                  Icon={UserSquare}
                  unit="cm"
                  returnKeyType="done"
                  onSubmitEditing={() => form.submitForm()}
                />
              )}
            </>
          )}

          {!submitted && (
            <SubmitBar
              loading={isPending}
              label="Calculate Body Comp"
              onPress={() => {
                Keyboard.dismiss();
                form.submitForm();
              }}
              disabled={isPending}
              bgColor={CARD_COLORS.BodyComposition}
            />
          )}

          {submitted && data && (
            <>
              <SubmitBar
                loading={isPending}
                label="Recalculate"
                onPress={() => {
                  Keyboard.dismiss();
                  form.submitForm();
                }}
                disabled={isPending}
                bgColor={CARD_COLORS.BodyComposition}
              />
              <View style={{ gap: 8 }}>
                <ResultCard
                  color={CARD_COLORS.BodyComposition}
                  title="Body Composition Result"
                  rows={[
                    {
                      label: "Body Fat %",
                      value: `${data.bodyFatPercent.toFixed(1)}%`,
                    },
                    {
                      label: "Lean Mass",
                      value: `${data.leanBodyMassKg.toFixed(1)} kg`,
                    },
                    {
                      label: "Fat Mass",
                      value: `${data.fatMassKg.toFixed(1)} kg`,
                    },
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
      </ThemedView>
    </KeyboardAwareScrollView>
  );
};

export default BodyCompForm;

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
