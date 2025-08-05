import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as Yup from "yup";

import { Collapsible } from "@/components/Collapsible";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useSaveCalculation from "@/hooks/useSaveCalculation";
import { useThemeColor } from "@/hooks/useThemeColor";
import { postToEdgeFunction } from "@/services/calculationService";

interface FormValues {
  equation: string;
  gender: string;
  age: string;
  weightKg: string;
  heightCm?: string;
  bodyFatPercent?: string;
}

const validationSchema = Yup.object().shape({
  equation: Yup.string().required("Required"),
  gender: Yup.string().oneOf(["male", "female"]).required("Required"),
  age: Yup.number().typeError("Invalid number").positive().integer().required("Required"),
  weightKg: Yup.number().typeError("Invalid number").positive().required("Required"),
  heightCm: Yup.number()
    .typeError("Invalid number")
    .positive()
    .when("equation", {
      is: (val: string) => val !== "katch-mcardle",
      then: (schema) => schema.required("Required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  bodyFatPercent: Yup.number()
    .typeError("Invalid number")
    .min(0)
    .max(100)
    .when("equation", {
      is: "katch-mcardle",
      then: (schema) => schema.required("Required"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export default function BMRCalculatorScreen() {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "icon");
  const saveCalculation = useSaveCalculation();

  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const payload: any = {
        equation: values.equation,
        gender: values.gender,
        age: Number(values.age),
        weightKg: Number(values.weightKg),
      };
      if (values.equation === "katch-mcardle") {
        payload.bodyFatPercent = Number(values.bodyFatPercent);
      } else {
        payload.heightCm = Number(values.heightCm);
      }

      const data = await postToEdgeFunction("calculate-bmr", payload);
      const bmrValue = data?.bmr ?? data;
      setResult(bmrValue);

      try {
        await saveCalculation("BMR", payload, { bmr: bmrValue });
      } catch (error) {
        console.error("Failed to save calculation", error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to calculate BMR. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Formik
        initialValues={{
          equation: "mifflin",
          gender: "male",
          age: "",
          weightKg: "",
          heightCm: "",
          bodyFatPercent: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          setFieldValue,
          errors,
          touched,
        }) => (
          <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>
              BMR Calculator
            </ThemedText>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Equation</ThemedText>
              <Picker
                selectedValue={values.equation}
                onValueChange={(val) => setFieldValue("equation", val)}
                style={[styles.picker, { color: textColor }]}
              >
                <Picker.Item label="Mifflin" value="mifflin" />
                <Picker.Item label="Harris-Benedict" value="harris-benedict" />
                <Picker.Item label="Katch-McArdle" value="katch-mcardle" />
              </Picker>
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Gender</ThemedText>
              <Picker
                selectedValue={values.gender}
                onValueChange={(val) => setFieldValue("gender", val)}
                style={[styles.picker, { color: textColor }]}
              >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Age</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor, borderColor }]}
                placeholder="Age in years"
                placeholderTextColor={borderColor}
                keyboardType="numeric"
                onChangeText={handleChange("age")}
                onBlur={handleBlur("age")}
                value={values.age}
              />
              {touched.age && errors.age && (
                <ThemedText style={styles.error}>{errors.age}</ThemedText>
              )}
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Weight (kg)</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor, borderColor }]}
                placeholder="Weight in kg"
                placeholderTextColor={borderColor}
                keyboardType="numeric"
                onChangeText={handleChange("weightKg")}
                onBlur={handleBlur("weightKg")}
                value={values.weightKg}
              />
              {touched.weightKg && errors.weightKg && (
                <ThemedText style={styles.error}>{errors.weightKg}</ThemedText>
              )}
            </View>

            {values.equation !== "katch-mcardle" && (
              <View style={styles.field}>
                <ThemedText style={styles.label}>Height (cm)</ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor }]}
                  placeholder="Height in cm"
                  placeholderTextColor={borderColor}
                  keyboardType="numeric"
                  onChangeText={handleChange("heightCm")}
                  onBlur={handleBlur("heightCm")}
                  value={values.heightCm}
                />
                {touched.heightCm && errors.heightCm && (
                  <ThemedText style={styles.error}>{errors.heightCm}</ThemedText>
                )}
              </View>
            )}

            {values.equation === "katch-mcardle" && (
              <View style={styles.field}>
                <ThemedText style={styles.label}>Body Fat %</ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor }]}
                  placeholder="Body fat percentage"
                  placeholderTextColor={borderColor}
                  keyboardType="numeric"
                  onChangeText={handleChange("bodyFatPercent")}
                  onBlur={handleBlur("bodyFatPercent")}
                  value={values.bodyFatPercent}
                />
                {touched.bodyFatPercent && errors.bodyFatPercent && (
                  <ThemedText style={styles.error}>
                    {errors.bodyFatPercent}
                  </ThemedText>
                )}
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: tintColor }]}
              onPress={() => handleSubmit()}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Calculate</ThemedText>
              )}
            </TouchableOpacity>

            {result !== null && (
              <View style={styles.result}>
                <Collapsible title="Result">
                  <ThemedText>
                    Your BMR is {Math.round(result)} kcal/day
                  </ThemedText>
                </Collapsible>
              </View>
            )}
          </ThemedView>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  picker: {
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    marginTop: 24,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    marginTop: 4,
    color: "#ef4444",
  },
  result: {
    marginTop: 32,
  },
});
