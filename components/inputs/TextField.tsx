import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { Controller, Control } from 'react-hook-form';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import { useTheme } from '@/theme';

export interface TextFieldProps extends TextInputProps {
  name: string;
  control: Control<any>;
  label: string;
}

export function TextField({ name, control, label, ...rest }: TextFieldProps) {
  const { colors, spacing, typography } = useTheme();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={{ marginBottom: spacing.md }}>
          <Text style={{
            fontFamily: typography.fontFamily.bold,
            fontSize: typography.fontSize.sm,
            marginBottom: spacing.xs,
            color: colors.text,
          }}>{label}</Text>
          <TextInput
            style={styles.input(colors, spacing, typography)}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor={colors.icon}
            {...rest}
          />
          {error && <Text style={{ color: '#ef4444', marginTop: spacing.xs }}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

const styles = {
  input: (colors: any, spacing: typeof import('@/theme').spacing, typography: typeof import('@/theme').typography) =>
    StyleSheet.create({
      input: {
        borderWidth: 1,
        borderColor: colors.icon,
        padding: spacing.sm,
        borderRadius: spacing.xs,
        color: colors.text,
        fontSize: typography.fontSize.md,
      },
    }).input,
};
