import { useAuth } from "@/contexts/AuthContext";
import { useSaveCalculation } from "@/hooks/mutations/useSaveCalculation";
import { Formik } from "formik";
import React from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as yup from "yup";

const ACTIVITY_LEVELS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const validationSchema = yup.object().shape({
  age: yup.number().required().min(10).max(100),
  weight: yup.number().required().min(30).max(200),
  height: yup.number().required().min(100).max(250),
  gender: yup.string().oneOf(["male", "female"]).required(),
  activity: yup.string().oneOf(Object.keys(ACTIVITY_LEVELS)).required(),
});

export default function TDEEForm() {
  const { session } = useAuth();
  const userId = session?.user.id || "";
  const saveCalculation = useSaveCalculation(userId);

  const handleSubmit = (values: any) => {
    const { weight, height, age, gender, activity } = values;
    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const multiplier =
      ACTIVITY_LEVELS[activity as keyof typeof ACTIVITY_LEVELS];
    const tdee = Math.round(bmr * multiplier);

    saveCalculation.mutate(
      {
        type: "TDEE",
        result: { tdee },
        input: { ...values, bmr },
      },
      {
        onSuccess: () => Alert.alert("Saved", `TDEE: ${tdee} kcal`),
        onError: (err: any) => Alert.alert("Error", err.message),
      }
    );
  };

  return (
    <Formik
      initialValues={{
        age: "",
        weight: "",
        height: "",
        gender: "male",
        activity: "moderate",
      }}
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
        <View>
          <Text style={styles.title}>🔥 TDEE Calculator</Text>

          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={values.age}
            onChangeText={handleChange("age")}
            onBlur={handleBlur("age")}
          />
          {touched.age && errors.age && (
            <Text style={styles.error}>{errors.age}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={values.weight}
            onChangeText={handleChange("weight")}
            onBlur={handleBlur("weight")}
          />
          {touched.weight && errors.weight && (
            <Text style={styles.error}>{errors.weight}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            keyboardType="numeric"
            value={values.height}
            onChangeText={handleChange("height")}
            onBlur={handleBlur("height")}
          />
          {touched.height && errors.height && (
            <Text style={styles.error}>{errors.height}</Text>
          )}

          <View style={styles.genderRow}>
            <Button
              title="Male"
              onPress={() => setFieldValue("gender", "male")}
              color={values.gender === "male" ? "#0a7ea4" : "#aaa"}
            />
            <Button
              title="Female"
              onPress={() => setFieldValue("gender", "female")}
              color={values.gender === "female" ? "#0a7ea4" : "#aaa"}
            />
          </View>

          <Text style={styles.subtitle}>Activity Level</Text>
          {Object.keys(ACTIVITY_LEVELS).map((level) => (
            <Button
              key={level}
              title={level.replace("_", " ")}
              color={values.activity === level ? "#0a7ea4" : "#aaa"}
              onPress={() => setFieldValue("activity", level)}
            />
          ))}

          <View style={{ marginTop: 16 }}>
            <Button title="Calculate TDEE" onPress={() => handleSubmit()} />
          </View>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  subtitle: { fontSize: 16, fontWeight: "500", marginTop: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
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
