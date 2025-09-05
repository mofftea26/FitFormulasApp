import { FormikProvider } from "formik";
import { Ruler, Scale, User2, UserSquare } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
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
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useZodFormik } from "../hooks/uzeZodFormik";

const schema = z
  .object({
    weightKg: z.coerce.number().positive(),
    mode: z.enum(["bfInput", "usNavy"]),
    bodyFatPercent: z.coerce.number().min(3).max(70).optional(),
    gender: z.enum(["male", "female"]).optional(),
    heightCm: z.coerce.number().positive().optional(),
    neckCm: z.coerce.number().positive().optional(),
    waistCm: z.coerce.number().positive().optional(),
    hipCm: z.coerce.number().positive().optional(),
  })
  .refine(
    (v) =>
      v.mode === "bfInput"
        ? !!v.bodyFatPercent
        : v.gender &&
          v.heightCm &&
          v.neckCm &&
          v.waistCm &&
          (v.gender === "male" || v.hipCm),
    {
      message:
        "Provide Body Fat %, or all US Navy fields (hip required for females).",
    }
  );

type Values = z.infer<typeof schema>;

const genders = [
  { value: "male" as Gender, label: "Male", Icon: User2 },
  { value: "female" as Gender, label: "Female", Icon: User2 },
];

const BodyCompForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const tintColor = useThemeColor({}, "tint");
  const { mutateAsync, isPending, data } = useCalcBodyComp();
  const [submitted, setSubmitted] = useState(false);
  const weightRef = useRef<TextInput>(null);
  const heightRef = useRef<TextInput>(null);
  const neckRef = useRef<TextInput>(null);
  const waistRef = useRef<TextInput>(null);
  const hipRef = useRef<TextInput>(null);
  const bodyFatPercentRef = useRef<TextInput>(null);
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
    } as unknown as Values,
    onSubmit: async (v) => {
      await mutateAsync({
        userId: userId ?? "anonymous",
        weightKg: Number(v.weightKg),
        bodyFatPercent:
          v.mode === "bfInput" ? Number(v.bodyFatPercent) : undefined,
        gender: v.mode === "usNavy" ? v.gender : undefined,
        heightCm: v.mode === "usNavy" ? Number(v.heightCm) : undefined,
        neckCm: v.mode === "usNavy" ? Number(v.neckCm) : undefined,
        waistCm: v.mode === "usNavy" ? Number(v.waistCm) : undefined,
        hipCm:
          v.mode === "usNavy" && v.gender === "female"
            ? Number(v.hipCm)
            : undefined,
      });
      setSubmitted(true);
    },
  });

  const mode = form.values.mode;
  const isFemale = form.values.gender === "female";

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
          Body Composition
        </ThemedText>

        <EnumChips
          value={mode}
          onChange={(v) => form.setFieldValue("mode", v)}
          options={[
            { value: "bfInput", label: "I know my BF%" },
            { value: "usNavy", label: "Estimate (US Navy)" },
          ]}
        />
        {mode === "usNavy" && (
          <EnumChips
            value={form.values.gender!}
            onChange={(v) => form.setFieldValue("gender", v)}
            options={genders}
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
              if (mode === "bfInput") {
                bodyFatPercentRef.current?.focus();
              } else {
                heightRef.current?.focus();
              }
            }}
          />

          {mode === "bfInput" ? (
            <FormTextInput
              ref={bodyFatPercentRef}
              name="bodyFatPercent"
              label="Body Fat %"
              placeholder="e.g., 15"
              keyboardType="numeric"
              unit="%"
              returnKeyType="done"
            />
          ) : (
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
                blurOnSubmit={isFemale}
                onSubmitEditing={() => hipRef.current?.focus()}
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
                  onSubmitEditing={form.handleSubmit as any}
                />
              )}
            </>
          )}

          {!submitted && (
            <Pressable onPress={form.handleSubmit as any}>
              <SubmitBar loading={isPending} label="Calculate Body Comp" />
            </Pressable>
          )}

          {submitted && data && (
            <View style={{ gap: 8 }}>
              <ResultCard
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
