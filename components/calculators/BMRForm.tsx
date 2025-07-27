import { useAuth } from "@/contexts/AuthContext";
import { useSaveCalculation } from "@/hooks/mutations/useSaveCalculation";
import { Formik } from "formik";
import React from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
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
        <View>
          <Text style={styles.title}>🧮 BMR Calculator</Text>

          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            onChangeText={handleChange("age")}
            onBlur={handleBlur("age")}
            value={values.age}
          />
          {touched.age && errors.age && (
            <Text style={styles.error}>{errors.age}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            onChangeText={handleChange("weight")}
            onBlur={handleBlur("weight")}
            value={values.weight}
          />
          {touched.weight && errors.weight && (
            <Text style={styles.error}>{errors.weight}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            keyboardType="numeric"
            onChangeText={handleChange("height")}
            onBlur={handleBlur("height")}
            value={values.height}
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

          <Button title="Calculate BMR" onPress={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
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
