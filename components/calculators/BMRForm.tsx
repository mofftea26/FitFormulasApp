import { useAuth } from "@/contexts/AuthContext";
import { useSaveCalculation } from "@/hooks/mutations/useSaveCalculation";
import { Formik } from "formik";
import React from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  age: yup.number().required().min(10).max(100),
  weight: yup.number().required().min(30).max(200),
  height: yup.number().required().min(100).max(250),
  gender: yup.string().oneOf(["male", "female"]).required(),
});

export default function BMRForm() {
  const { session } = useAuth();
  const userId = session?.user.id || "";
  const saveCalculation = useSaveCalculation(userId);
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const handleSubmit = (values: any) => {
    const { weight, height, age, gender } = values;
    let bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    saveCalculation.mutate(
      {
        type: "BMR",
        result: { bmr },
        input: { ...values },
      },
      {
        onSuccess: () => Alert.alert("Saved", `BMR: ${Math.round(bmr)} kcal`),
        onError: (err: any) => Alert.alert("Error", err.message),
      }
    );
  };

  return (
    <Formik
      initialValues={{ age: "", weight: "", height: "", gender: "male" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <ThemedView>
          <ThemedText style={styles.title}>🧮 BMR Calculator</ThemedText>

          <TextInput
            style={[styles.input, { borderColor: iconColor }]}
            placeholder="Age"
            keyboardType="numeric"
            onChangeText={handleChange("age")}
            onBlur={handleBlur("age")}
            value={values.age}
          />
          {touched.age && errors.age && (
            <ThemedText style={styles.error}>{errors.age}</ThemedText>
          )}

          <TextInput
            style={[styles.input, { borderColor: iconColor }]}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            onChangeText={handleChange("weight")}
            onBlur={handleBlur("weight")}
            value={values.weight}
          />
          {touched.weight && errors.weight && (
            <ThemedText style={styles.error}>{errors.weight}</ThemedText>
          )}

          <TextInput
            style={[styles.input, { borderColor: iconColor }]}
            placeholder="Height (cm)"
            keyboardType="numeric"
            onChangeText={handleChange("height")}
            onBlur={handleBlur("height")}
            value={values.height}
          />
          {touched.height && errors.height && (
            <ThemedText style={styles.error}>{errors.height}</ThemedText>
          )}

          <ThemedView style={styles.genderRow}>
            <Button
              title="Male"
              onPress={() => setFieldValue("gender", "male")}
              color={values.gender === "male" ? tintColor : iconColor}
            />
            <Button
              title="Female"
              onPress={() => setFieldValue("gender", "female")}
              color={values.gender === "female" ? tintColor : iconColor}
            />
          </ThemedView>

          <Button title="Calculate BMR" onPress={() => handleSubmit()} />
        </ThemedView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 6,
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  error: {
    color: "red",
    marginBottom: 5,
    marginLeft: 5,
    fontSize: 13,
  },
});
