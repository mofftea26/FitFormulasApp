import { Gender } from "@/api/calculators/models";
import { useCalcBodyComp } from "@/api/calculators/queries";
import { EnumChips } from "@/components/shared/forms/EnumChips";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { ResultCard } from "@/components/shared/forms/ResultCard";
import { SubmitBar } from "@/components/shared/forms/SubmitBar";
import { useAuth } from "@/contexts/AuthContext";
import { FormikProvider } from "formik";
import { Ruler, Scale, User2, UserSquare } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { useZodFormik } from "../hooks/uzeZodFormik";

const schema = z
  .object({
    weightKg: z.coerce.number().positive(),
    mode: z.enum(["bfInput", "usNavy"]), // UI-only
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
  const { mutateAsync, isPending, data } = useCalcBodyComp();
  const [submitted, setSubmitted] = useState(false);

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
    <View style={{ gap: 12 }}>
      <Text style={styles.title}>Body Composition</Text>

      <EnumChips
        value={mode}
        onChange={(v) => form.setFieldValue("mode", v)}
        options={[
          { value: "bfInput", label: "I know my BF%" },
          { value: "usNavy", label: "Estimate (US Navy)" },
        ]}
      />

      <FormikProvider value={form}>
        <FormTextInput
          name="weightKg"
          label="Weight"
          placeholder="e.g., 88"
          keyboardType="numeric"
          Icon={Scale}
          unit="kg"
        />

        {mode === "bfInput" ? (
          <FormTextInput
            name="bodyFatPercent"
            label="Body Fat %"
            placeholder="e.g., 15"
            keyboardType="numeric"
            unit="%"
          />
        ) : (
          <>
            <EnumChips
              value={form.values.gender!}
              onChange={(v) => form.setFieldValue("gender", v)}
              options={genders}
            />
            <FormTextInput
              name="heightCm"
              label="Height"
              placeholder="e.g., 175"
              keyboardType="numeric"
              Icon={Ruler}
              unit="cm"
            />
            <FormTextInput
              name="neckCm"
              label="Neck"
              placeholder="e.g., 40"
              keyboardType="numeric"
              Icon={UserSquare}
              unit="cm"
            />
            <FormTextInput
              name="waistCm"
              label="Waist"
              placeholder="e.g., 82"
              keyboardType="numeric"
              Icon={UserSquare}
              unit="cm"
            />
            {isFemale && (
              <FormTextInput
                name="hipCm"
                label="Hip"
                placeholder="e.g., 95"
                keyboardType="numeric"
                Icon={UserSquare}
                unit="cm"
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
                { label: "Fat Mass", value: `${data.fatMassKg.toFixed(1)} kg` },
              ]}
            />
            <Pressable onPress={onDone} style={styles.closeBtn}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Close</Text>
            </Pressable>
          </View>
        )}
      </FormikProvider>
    </View>
  );
};
export default BodyCompForm;

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: "700" },
  closeBtn: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
});
