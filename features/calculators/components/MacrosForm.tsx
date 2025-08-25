import React from 'react';
import { Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TextField } from '@/components/inputs/TextField';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useTheme } from '@/theme';
import { macrosSchema, MacrosForm } from '@/utils/form';
import { useAuth } from '@/contexts/AuthContext';

const goals = ['fatLoss', 'maintenance', 'muscleGain'] as const;
const activities = ['sedentary','light','moderate','active','very_active'] as const;

export default function MacrosForm() {
  const { session } = useAuth();
  const userId = session?.user.id || '';
  const { colors, spacing, typography } = useTheme();

  const { control, handleSubmit, watch, setValue } = useForm<MacrosForm>({
    resolver: zodResolver(macrosSchema),
    defaultValues: { weight: '', goal: 'maintenance', tdee: '', bmr: '', activity: 'moderate' },
  });

  const goal = watch('goal');
  const tdee = watch('tdee');

  const onSubmit = async (values: MacrosForm) => {
    try {
      const res = await fetch('https://gxrxyjeacovzbmczydgw.supabase.co/functions/v1/macros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          weightKg: parseFloat(values.weight),
          goal: values.goal,
          tdee: values.tdee ? parseFloat(values.tdee) : undefined,
          bmr: values.bmr ? parseFloat(values.bmr) : undefined,
          activityLevel: values.activity,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to calculate');
      Alert.alert('Macros', `Calories: ${data.calories}\nProtein: ${data.protein}g\nCarbs: ${data.carbs}g\nFat: ${data.fat}g`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ThemedView>
      <ThemedText style={styles.title(typography, spacing)}>🍽️ Macros Calculator</ThemedText>
      <TextField control={control} name="weight" label="Weight (kg)" keyboardType="numeric" />
      <View style={styles.row(spacing)}>
        {goals.map(g => (
          <TouchableOpacity
            key={g}
            style={styles.option(spacing, colors, goal === g)}
            onPress={() => setValue('goal', g)}
          >
            <ThemedText style={styles.optionText(typography, colors, goal === g)}>{g}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <TextField control={control} name="tdee" label="TDEE (kcal)" keyboardType="numeric" />
      {!tdee && (
        <>
          <TextField control={control} name="bmr" label="BMR (kcal)" keyboardType="numeric" />
          <View style={styles.row(spacing)}>
            {activities.map(a => (
              <TouchableOpacity
                key={a}
                style={styles.option(spacing, colors, watch('activity') === a)}
                onPress={() => setValue('activity', a)}
              >
                <ThemedText style={styles.optionText(typography, colors, watch('activity') === a)}>{a}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      <PrimaryButton label="Calculate Macros" onPress={handleSubmit(onSubmit)} />
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
