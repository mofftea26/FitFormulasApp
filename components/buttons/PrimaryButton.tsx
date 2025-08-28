// @ts-nocheck
import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps } from 'react-native';
import { useTheme } from '@/theme';

export type PrimaryButtonProps = PressableProps & {
  label: string;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, style, ...rest }) => {
  const { colors, spacing, typography } = useTheme();
  return (
    <Pressable
      style={[styles.button(spacing, colors), style]}
      accessibilityRole="button"
      {...rest}
    >
      <Text style={styles.label(colors, typography)}>{label}</Text>
    </Pressable>
  );
};

const styles = {
  button: (spacing: typeof import('@/theme').spacing, colors: any) =>
    StyleSheet.create({
      button: {
        backgroundColor: colors.tint,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: spacing.sm,
      },
    }).button,
  label: (colors: any, typography: typeof import('@/theme').typography) =>
    StyleSheet.create({
      label: {
        color: colors.background,
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.md,
        textAlign: 'center',
      },
    }).label,
};
