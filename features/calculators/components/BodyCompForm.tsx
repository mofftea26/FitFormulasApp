import React from 'react';
import { Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TextField } from '@/components/inputs/TextField';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useTheme } from '@/theme';
import { bodyCompSchema, BodyCompForm } from '@/utils/form';
import { useAuth } from '@/contexts/AuthContext';

export default function BodyCompForm() {
  const { session } = useAuth();
  const userId = session?.user.id || '';
  const { colors, spacing, typography } = useTheme();

  const { control, handleSubmit, watch, setValue } = useForm<BodyCompForm>({
    resolver: zodResolver(bodyCompSchema),
    defaultValues: {
      weight: '',
      bodyFatPercent: '',
      gender: 'male',
      height: '',
      neck: '',
      waist: '',
      hip: '',
    },
  });

  const gender = watch('gender');

  const onSubmit = async (values: BodyCompForm) => {
    try {
      const res = await fetch('https://gxrxyjeacovzbmczydgw.supabase.co/functions/v1/lbm-fatmass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          weightKg: parseFloat(values.weight),
          bodyFatPercent: values.bodyFatPercent ? parseFloat(values.bodyFatPercent) : undefined,
          gender: values.gender,
          heightCm: values.height ? parseFloat(values.height) : undefined,
          neckCm: values.neck ? parseFloat(values.neck) : undefined,
          waistCm: values.waist ? parseFloat(values.waist) : undefined,
          hipCm: values.hip ? parseFloat(values.hip) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to calculate');
      Alert.alert('Body Composition', `BF%: ${data.bodyFatPercent}%\nLean Mass: ${data.leanBodyMassKg}kg\nFat Mass: ${data.fatMassKg}kg`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ThemedView>
      <ThemedText style={styles.title(typography, spacing)}>🧍 Body Composition</ThemedText>
      <TextField control={control} name="weight" label="Weight (kg)" keyboardType="numeric" />
      <TextField control={control} name="bodyFatPercent" label="Body Fat % (optional)" keyboardType="numeric" />
      <View style={styles.row(spacing)}>
        {(['male','female'] as const).map(g => (
          <TouchableOpacity
            key={g}
            style={styles.option(spacing, colors, gender === g)}
            onPress={() => setValue('gender', g)}
          >
            <ThemedText style={styles.optionText(typography, colors, gender === g)}>{g}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <TextField control={control} name="height" label="Height (cm)" keyboardType="numeric" />
      <TextField control={control} name="neck" label="Neck (cm)" keyboardType="numeric" />
      <TextField control={control} name="waist" label="Waist (cm)" keyboardType="numeric" />
      {gender === 'female' && (
        <TextField control={control} name="hip" label="Hip (cm)" keyboardType="numeric" />
      )}
      <PrimaryButton label="Calculate" onPress={handleSubmit(onSubmit)} />
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
  row: (spacing: typeof import('@/theme').spacing) =>
    StyleSheet.create({
      row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.md,
      },
    }).row,
  option: (
    spacing: typeof import('@/theme').spacing,
    colors: any,
    active: boolean,
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
  optionText: (
    typography: typeof import('@/theme').typography,
    colors: any,
    active: boolean,
  ) =>
    StyleSheet.create({
      txt: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.md,
        color: active ? colors.background : colors.text,
      },
    }).txt,
};
