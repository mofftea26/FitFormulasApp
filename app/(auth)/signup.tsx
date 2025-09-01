import { Link } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { signUpWithEmail } from "@/services/authService";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const { user } = await signUpWithEmail(email, password);

      if (user) {
        Alert.alert(
          "Success",
          "Account created successfully! Please check your email to verify your account.",
          [
            {
              text: "OK",
              onPress: () => {
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.container}>
          <ThemedView style={styles.header}>
            <ThemedText type="title">Create Account</ThemedText>
            <ThemedText style={styles.subtitle}>
              Sign up to get started with your fitness journey
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.form}>
            <ThemedView style={styles.inputContainer}>
              <ThemedText type="subtitle">Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: backgroundColor,
                    color: textColor,
                    borderColor: textColor,
                  },
                ]}
                placeholder="Enter your email"
                placeholderTextColor={textColor + "80"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText type="subtitle">Password</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: backgroundColor,
                    color: textColor,
                    borderColor: textColor,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={textColor + "80"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText type="subtitle">Confirm Password</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: backgroundColor,
                    color: textColor,
                    borderColor: textColor,
                  },
                ]}
                placeholder="Confirm your password"
                placeholderTextColor={textColor + "80"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </ThemedView>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: isLoading ? textColor + "40" : tintColor,
                },
              ]}
              onPress={handleSignup}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <ThemedText
                style={[styles.buttonText, { color: backgroundColor }]}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.footer}>
            <ThemedText>Already have an account? </ThemedText>
            <Link href="/(auth)/signin" asChild>
              <ThemedText type="link">Sign In</ThemedText>
            </Link>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    opacity: 0.7,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
});
