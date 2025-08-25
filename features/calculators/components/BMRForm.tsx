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

export default function BMRForm() {
  const { session } = useAuth();
  const userId = session?.user.id || '';
  const { colors, spacing, typography } = useTheme();

  const { control, handleSubmit, watch, setValue } = useForm<BmrForm>({
    resolver: zodResolver(bmrSchema),
    defaultValues: {
      age: '',
      weight: '',
      height: '',
      gender: 'male',
      equation: 'mifflin',
    },
  });

  const gender = watch('gender');
  const equation = watch('equation');

  const onSubmit = async (values: BmrForm) => {
    try {
      const res = await fetch(
        'https://gxrxyjeacovzbmczydgw.supabase.co/functions/v1/bmr',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            weightKg: parseFloat(values.weight),
            heightCm: parseFloat(values.height),
            age: parseFloat(values.age),
            gender: values.gender,
            bodyFatPercent: values.bodyFatPercent
              ? parseFloat(values.bodyFatPercent)
              : undefined,
            equation: values.equation,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to calculate');
      Alert.alert('BMR', `${data.bmr} kcal`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
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
      <View style={styles.genderRow(spacing)}>
        {(['mifflin', 'harris', 'katch'] as const).map((e) => (
          <TouchableOpacity
            key={e}
            style={styles.genderButton(spacing, colors, equation === e)}
            onPress={() => setValue('equation', e)}
            accessibilityRole="button"
          >
            <ThemedText style={styles.genderText(typography, colors, equation === e)}>
              {e}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      {equation === 'katch' && (
        <TextField
          control={control}
          name="bodyFatPercent"
          label="Body Fat %"
          keyboardType="numeric"
        />
      )}
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
