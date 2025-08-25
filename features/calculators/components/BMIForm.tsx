import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TextField } from '@/components/inputs/TextField';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useTheme } from '@/theme';
import { bmiSchema, BmiForm } from '@/utils/form';
import { useAuth } from '@/contexts/AuthContext';

export default function BMIForm() {
  const { session } = useAuth();
  const userId = session?.user.id || '';
  const { spacing, typography } = useTheme();

  const { control, handleSubmit } = useForm<BmiForm>({
    resolver: zodResolver(bmiSchema),
    defaultValues: { weight: '', height: '' },
  });

  const onSubmit = async (values: BmiForm) => {
    try {
      const res = await fetch('https://gxrxyjeacovzbmczydgw.supabase.co/functions/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          weightKg: parseFloat(values.weight),
          heightCm: parseFloat(values.height),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to calculate');
      Alert.alert('BMI', `${data.bmi} (${data.category})`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ThemedView>
      <ThemedText style={styles.title(typography, spacing)}>⚖️ BMI Calculator</ThemedText>
      <TextField control={control} name="weight" label="Weight (kg)" keyboardType="numeric" />
      <TextField control={control} name="height" label="Height (cm)" keyboardType="numeric" />
      <PrimaryButton label="Calculate BMI" onPress={handleSubmit(onSubmit)} />
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
};
