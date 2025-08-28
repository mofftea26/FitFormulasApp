import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import BMRForm from '@/features/calculators/components/BMRForm';
import TDEEForm from '@/features/calculators/components/TDEEForm';
import MacrosForm from '@/features/calculators/components/MacrosForm';
import BMIForm from '@/features/calculators/components/BMIForm';
import BodyCompForm from '@/features/calculators/components/BodyCompForm';
import { useThemeColor } from '@/hooks/useThemeColor';

const CALCS = [
  { key: 'BMR', icon: 'flame' },
  { key: 'TDEE', icon: 'pulse' },
  { key: 'Macros', icon: 'restaurant' },
  { key: 'BMI', icon: 'body' },
  { key: 'BodyComp', icon: 'accessibility' },
] as const;

type CalcType = typeof CALCS[number]['key'];

export default function CalculatorsScreen() {
  const params = useLocalSearchParams<{ type?: CalcType }>();
  const [active, setActive] = useState<CalcType | null>(null);
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');

  useEffect(() => {
    if (params.type && CALCS.some(c => c.key === params.type)) {
      setActive(params.type);
    }
  }, [params.type]);

  const renderForm = () => {
    switch (active) {
      case 'BMR':
        return <BMRForm />;
      case 'TDEE':
        return <TDEEForm />;
      case 'Macros':
        return <MacrosForm />;
      case 'BMI':
        return <BMIForm />;
      case 'BodyComp':
        return <BodyCompForm />;
      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.grid}>
        {CALCS.map((calc) => (
          <TouchableOpacity
            key={calc.key}
            style={[styles.card, { backgroundColor: background }]}
            onPress={() => setActive(calc.key)}
          >
            <Ionicons name={calc.icon as any} size={32} color={text} />
            <ThemedText>{calc.key}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        visible={!!active}
        animationType="slide"
        transparent
        onRequestClose={() => setActive(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, { backgroundColor: background }]}> 
            <TouchableOpacity style={styles.close} onPress={() => setActive(null)}>
              <Ionicons name="close" size={24} color={text} />
            </TouchableOpacity>
            {renderForm()}
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    maxHeight: '80%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  close: { alignSelf: 'flex-end' },
});
