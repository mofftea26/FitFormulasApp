import React from 'react';
import { Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TextField } from '@/components/inputs/TextField';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useTheme } from '@/theme';
import { bmrSchema, BmrForm } from '@/utils/form';
import { useAuth } from '@/contexts/AuthContext';
import { useSaveCalculation } from '@/hooks/mutations/useSaveCalculation';

export default function BMRForm() {
  const { session } = useAuth();
  const userId = session?.user.id || '';
  const saveCalculation = useSaveCalculation(userId);
  const { colors, spacing, typography } = useTheme();

  const { control, handleSubmit, watch, setValue } = useForm<BmrForm>({
    resolver: zodResolver(bmrSchema),
    defaultValues: { age: '', weight: '', height: '', gender: 'male' },
  });

  const gender = watch('gender');

  const onSubmit = (values: BmrForm) => {
    const age = parseFloat(values.age);
    const weight = parseFloat(values.weight);
    const height = parseFloat(values.height);
    const bmr =
      values.gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    saveCalculation.mutate(
      { type: 'BMR', result: { bmr }, input: { ...values } },
      {
        onSuccess: () => Alert.alert('Saved', `BMR: ${Math.round(bmr)} kcal`),
        onError: (err: any) => Alert.alert('Error', err.message),
      }
    );
  };

  return (
    <ThemedView>
      <ThemedText style={styles.title(typography, spacing)}>🧮 BMR Calculator</ThemedText>
      <TextField control={control} name="age" label="Age" keyboardType="numeric" />
      <TextField control={control} name="weight" label="Weight (kg)" keyboardType="numeric" />
      <TextField control={control} name="height" label="Height (cm)" keyboardType="numeric" />
      <View style={styles.genderRow(spacing)}>
        {(['male', 'female'] as const).map((g) => (
          <TouchableOpacity
            key={g}
            style={styles.genderButton(spacing, colors, gender === g)}
            onPress={() => setValue('gender', g)}
            accessibilityRole="button"
          >
            <ThemedText style={styles.genderText(typography, colors, gender === g)}>
              {g === 'male' ? 'Male' : 'Female'}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <PrimaryButton label="Calculate BMR" onPress={handleSubmit(onSubmit)} />
    </ThemedView>
  );
}

const styles = {
  title: (typography: typeof import('@/theme').typography, spacing: typeof import('@/theme').spacing) =>
    StyleSheet.create({
      title: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.lg,
        marginBottom: spacing.md,
      },
    }).title,
  genderRow: (spacing: typeof import('@/theme').spacing) =>
    StyleSheet.create({
      row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.md,
      },
    }).row,
  genderButton: (
    spacing: typeof import('@/theme').spacing,
    colors: any,
    active: boolean
  ) =>
    StyleSheet.create({
      btn: {
        flex: 1,
        marginHorizontal: spacing.xs,
        paddingVertical: spacing.sm,
        borderRadius: spacing.xs,
        backgroundColor: active ? colors.tint : 'transparent',
        borderWidth: 1,
        borderColor: colors.tint,
        alignItems: 'center',
      },
    }).btn,
  genderText: (
    typography: typeof import('@/theme').typography,
    colors: any,
    active: boolean
  ) =>
    StyleSheet.create({
      txt: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.md,
        color: active ? colors.background : colors.text,
      },
    }).txt,
};
