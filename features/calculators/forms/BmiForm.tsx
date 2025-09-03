import { useCalcBmi } from "@/api/calculators/queries";
import { FormTextInput } from "@/components/shared/forms/FormTextInput";
import { ResultCard } from "@/components/shared/forms/ResultCard";
import { SubmitBar } from "@/components/shared/forms/SubmitBar";
import { useAuth } from "@/contexts/AuthContext";
import { FormikProvider } from "formik";
import { Ruler, Scale } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
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

  const form = useZodFormik(schema, {
    initialValues: { weightKg: "", heightCm: "" } as unknown as Values,
    onSubmit: async (v) => {
      await mutateAsync({
        userId: userId ?? "anonymous",
        weightKg: Number(v.weightKg),
        heightCm: Number(v.heightCm),
      });
      setSubmitted(true);
    },
  });

  return (
    <View style={{ gap: 12 }}>
      <Text style={styles.title}>BMI Calculator</Text>
      <FormikProvider value={form}>
        <FormTextInput
          name="weightKg"
          label="Weight"
          placeholder="e.g., 88"
          keyboardType="numeric"
          Icon={Scale}
          unit="kg"
        />
        <FormTextInput
          name="heightCm"
          label="Height"
          placeholder="e.g., 175"
          keyboardType="numeric"
          Icon={Ruler}
          unit="cm"
        />

        {!submitted && (
          <Pressable onPress={form.handleSubmit as any}>
            <SubmitBar loading={isPending} label="Calculate BMI" />
          </Pressable>
        )}
        {submitted && data && (
          <View style={{ gap: 8 }}>
            <ResultCard
              title="BMI Result"
              rows={[
                { label: "BMI", value: data.bmi.toFixed(1) },
                { label: "Category", value: data.category },
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
export default BmiForm;

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
