import { Colors } from "@/theme/constants/Colors";
import { useColorScheme } from "react-native";

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  fontFamily: {
    regular: "System",
    bold: "System-Bold",
  },
  fontSize: {
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },
};

export const useTheme = () => {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];
  return { colors, spacing, typography };
};

export type Theme = ReturnType<typeof useTheme>;
