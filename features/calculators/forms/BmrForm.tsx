import { BmrEquation, Gender } from "@/api/calculators/models";
import { useCalcBmr } from "@/api/calculators/queries";
import { EnumChips } from "@/components/shared/forms/EnumChips";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { ResultCard } from "@/components/shared/forms/ResultCard";
import { SubmitBar } from "@/components/shared/forms/SubmitBar";
import { useAuth } from "@/contexts/AuthContext";
import { FormikProvider } from "formik";
import { Calendar, Percent, Ruler, Scale, User2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { z } from "zod";
import { useZodFormik } from "../hooks/uzeZodFormik";

import { Colors } from "@/theme/constants/Colors";

const schema = z.object({
  weightKg: z.coerce.number().positive("Weight must be > 0"),
  heightCm: z.coerce.number().positive("Height must be > 0").optional(),
  age: z.coerce.number().int().min(10).max(100),
  gender: z.enum(["male", "female"]),
  bodyFatPercent: z.coerce.number().min(3).max(70).optional(),
  equation: z.enum(["mifflin", "harris", "katch"]),
});

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
  const icon = Colors[scheme].icon;

  const { mutateAsync, isPending, data } = useCalcBmr();
  const [submitted, setSubmitted] = useState(false);

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
      // Dynamic requirements
      if (
        (vals.equation === "mifflin" || vals.equation === "harris") &&
        !vals.heightCm
      ) {
        form.setFieldError("heightCm", "Height is required for Mifflin/Harris");
        return;
      }
      if (vals.equation === "katch" && !vals.bodyFatPercent) {
        form.setFieldError(
          "bodyFatPercent",
          "Body fat % is required for Katch"
        );
        return;
      }
      await mutateAsync({
        userId: userId ?? "anonymous",
        weightKg: Number(vals.weightKg),
        heightCm: vals.heightCm ? Number(vals.heightCm) : undefined,
        age: Number(vals.age),
        gender: vals.gender,
        bodyFatPercent: vals.bodyFatPercent
          ? Number(vals.bodyFatPercent)
          : undefined,
        equation: vals.equation,
      });
      setSubmitted(true);
    },
  });

  const needsHeight = useMemo(
    () =>
      form.values.equation === "mifflin" || form.values.equation === "harris",
    [form.values.equation]
  );
  const needsBF = form.values.equation === "katch";

  return (
    <View style={{ gap: 12 }}>
      <Text style={styles.title}>BMR Calculator</Text>

      <EnumChips
        value={form.values.gender}
        onChange={(v) => form.setFieldValue("gender", v)}
        options={genderOptions}
      />
      <EnumChips
        value={form.values.equation}
        onChange={(v) => form.setFieldValue("equation", v)}
        options={eqOptions}
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
        {needsHeight && (
          <FormTextInput
            name="heightCm"
            label="Height"
            placeholder="e.g., 175"
            keyboardType="numeric"
            Icon={Ruler}
            unit="cm"
          />
        )}
        <FormTextInput
          name="age"
          label="Age"
          placeholder="e.g., 30"
          keyboardType="numeric"
          Icon={Calendar}
        />
        {needsBF && (
          <FormTextInput
            name="bodyFatPercent"
            label="Body Fat %"
            placeholder="e.g., 15"
            keyboardType="numeric"
            Icon={Percent}
            unit="%"
          />
        )}

        {!submitted && (
          <Pressable onPress={form.handleSubmit as any}>
            <SubmitBar loading={isPending} label="Calculate BMR" />
          </Pressable>
        )}

        {submitted && data && (
          <View style={{ gap: 8 }}>
            <ResultCard
              title="BMR Result"
              rows={[
                { label: "BMR", value: `${Math.round(data.bmr)} kcal/day` },
                { label: "Equation", value: data.equation.toUpperCase() },
              ]}
            />
            <Pressable onPress={onDone} style={styles.closeBtn}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Close</Text>
            </Pressable>
          </View>
        )}
      </FormikProvider>

      <Text style={{ fontSize: 12, color: icon }}>
        Tip: Use Katch if you know body fat %; otherwise Mifflin is a solid
        default.
      </Text>
    </View>
  );
};

export default BmrForm;

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
